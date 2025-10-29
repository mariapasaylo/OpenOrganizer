/*
 * Authors: Michael Jagiello
 * Created: 2025-10-25
 * Updated: 2025-10-29
 *
 * This file has several helper functions for the testing suite.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package test

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"openorganizer/src/db"
	"openorganizer/src/models"
	"openorganizer/src/utils"
	"slices"
)

// pass and fail functions

func success() bool {
	successes = append(successes, true)
	return true
}

func fail() bool {
	successes = append(successes, false)
	return false
}

// table clearing

func clearAllTables() {
	envClear := models.ENVVars{
		CLEAR_DB_AUTH: true,
		CLEAR_DB_DATA: true,
	}
	db.EnsureDBTables(envClear)
}

func clearAuthTables() {
	envClear := models.ENVVars{
		CLEAR_DB_AUTH: true,
		CLEAR_DB_DATA: false,
	}
	db.EnsureDBTables(envClear)
}

func clearDataTables() {
	var envClear = models.ENVVars{
		CLEAR_DB_AUTH: false,
		CLEAR_DB_DATA: true,
	}
	db.EnsureDBTables(envClear)
}

// pad data

// pad data to multiple of 32
func pad32(data []byte) []byte {
	mod := len(data) % 32
	if mod == 0 {
		return data
	}
	padding := make([]byte, 32-mod)
	for i := range padding {
		padding[i] = ' '
	}
	return append(data, padding...)
}

// expect message to be certain status code and body length, print message on fail
// checks if err != nil, print and return on fail
// checks if response status code != expected status code unless expected == -1, print and return on fail
// checks if body length != expected body length unless expected == -1, print and return on fail
func expect(testNum string, response *http.Response, expectedStatusCode int, responseBody []byte, expectedBodyLength int, err error) bool {
	if err != nil {
		fmt.Printf("test%s(): error - ", testNum)
		return utils.PrintErrorLine(err)
	}
	if (response.StatusCode != expectedStatusCode) && (expectedStatusCode != -1) {
		fmt.Printf("test%s(): Expected response status code %v, but received %v with body \"%s\".\n", testNum, response.StatusCode, expectedStatusCode, responseBody)
		return false
	}
	if (len(responseBody) != expectedBodyLength) && (expectedBodyLength != -1) {
		fmt.Printf("test%s(): Expected response body length %v does not match with received length of %v.\n", testNum, expectedBodyLength, len(responseBody))
		fmt.Printf("Body: %s\n", responseBody)
		return false
	}
	return true
}

// send to server endpoint
// headers must be an even amount that are added in (i, i + 1) key-value pairs
func send(endpoint string, requestBody []byte, headers ...string) (response *http.Response, responseBody []byte, err error) {
	request, err := http.NewRequest("POST", url+endpoint, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, nil, err
	}
	if len(headers)%2 == 1 {
		return nil, nil, errors.New("odd number of headers")
	}
	for i := 0; i < len(headers); i += 2 {
		request.Header.Set(headers[i], headers[i+1])
	}

	response, err = http.DefaultClient.Do(request)
	if err != nil {
		return response, responseBody, err
	}
	utils.PrintErrorLine(err)
	defer response.Body.Close()
	responseBody, err = io.ReadAll(response.Body)
	return response, responseBody, err
}

// do a basic registration
func simpleRegister() (response *http.Response, responseBody []byte, err error) {
	username := pad32([]byte("username"))
	password := pad32([]byte("password"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, key1...)
	requestBody = append(requestBody, key2...)
	response, responseBody, err = send("register", requestBody)
	return response, responseBody, err
}

// do a basic registration and return the authentication header
func simpleAuthSetup() (authHeader []byte, err error) {
	response, responseBody, err := simpleRegister()
	if !expect("", response, 200, responseBody, 40, err) {
		return nil, err
	}
	userID := responseBody[0:8]
	token := responseBody[8:40]
	authHeader = append(userID, token...)
	return authHeader, nil
}

func packItem(item models.RowItems) (body []byte) {
	body = append(body, utils.BigintToBytes(item.ItemID)...)
	body = append(body, utils.BigintToBytes(item.LastModified)...)
	body = append(body, item.EncryptedData...)
	return body
}

func unpackItem(body []byte) (item models.RowItems) {
	item.ItemID = utils.BytesToBigint(body[0:8])
	item.LastModified = utils.BytesToBigint(body[8:16])
	item.EncryptedData = body[16:]
	return item
}

func compareItem(item1 models.RowItems, item2 models.RowItems) bool {
	if item1.ItemID != item2.ItemID {
		return false
	}
	if item1.LastModified != item2.LastModified {
		return false
	}
	if !slices.Equal(item1.EncryptedData, item2.EncryptedData) {
		return false
	}
	return true
}

// do a simple syncup and syncdown and verify what is sent is received
func simpleSync(testNumber string, encryptedSize int32, endpoint string, authHeader []byte) bool {
	_, responseBody, _ := send("", []byte{})
	maxRecordCount := utils.BytesToInt(responseBody)
	if maxRecordCount < 4 {
		fmt.Printf("maxRecordCount (%v) is less than 4\n", maxRecordCount)
		return false
	}

	item1 := models.RowItems{
		ItemID:        1,
		LastModified:  11,
		LastUpdated:   11,
		EncryptedData: utils.RandArray(encryptedSize),
	}
	item2 := models.RowItems{
		ItemID:        2,
		LastModified:  12,
		LastUpdated:   12,
		EncryptedData: utils.RandArray(encryptedSize),
	}
	item3 := models.RowItems{
		ItemID:        3,
		LastModified:  13,
		LastUpdated:   13,
		EncryptedData: utils.RandArray(encryptedSize),
	}
	item4 := models.RowItems{
		ItemID:        4,
		LastModified:  14,
		LastUpdated:   14,
		EncryptedData: utils.RandArray(encryptedSize),
	}
	requestBody := append(authHeader, utils.IntToBytes(4)...)
	requestBody = append(requestBody, packItem(item1)...)
	requestBody = append(requestBody, packItem(item2)...)
	requestBody = append(requestBody, packItem(item3)...)
	requestBody = append(requestBody, packItem(item4)...)

	_, responseBody, err := send("syncup/"+endpoint, requestBody)
	if utils.PrintErrorLine(err) {
		return false
	}
	if len(responseBody) != 1 {
		fmt.Printf("test%s: Expected response body length 1 does not match with received length of %v.\n", testNumber, len(responseBody))
		fmt.Printf("%s\n", responseBody)
		return false
	}
	if responseBody[0] != '\x00' {
		fmt.Printf("All insertions should have succeeded.\n")
		return false
	}

	_, responseBody, err = send("syncup/"+endpoint, requestBody)
	if utils.PrintErrorLine(err) {
		return false
	}
	if len(responseBody) != 1 {
		fmt.Printf("test%s: Expected response body length 1 does not match with received length of %v.\n", testNumber, len(responseBody))
		fmt.Printf("%s\n", responseBody)
		return false
	}
	if responseBody[0] != '\xF0' {
		fmt.Printf("All insertions should have failed.\n")
		return false
	}

	requestBody = append(authHeader, utils.BigintToBytes(-9223372036854775808)...)
	requestBody = append(requestBody, utils.BigintToBytes(9223372036854775807)...)
	_, responseBody, err = send("syncdown/"+endpoint, requestBody)
	if utils.PrintErrorLine(err) {
		return false
	}
	var packedSize int = int(encryptedSize) + 16
	if len(responseBody) != (4*packedSize)+4 {
		fmt.Printf("test%s: Expected response body length %v does not match with received length of %v.\n", testNumber, (4*packedSize)+4, len(responseBody))
		fmt.Printf("%s\n", responseBody)
		return false
	}

	item1Returned := unpackItem(responseBody[4+(0*packedSize) : 4+(1*packedSize)])
	item2Returned := unpackItem(responseBody[4+(1*packedSize) : 4+(2*packedSize)])
	item3Returned := unpackItem(responseBody[4+(2*packedSize) : 4+(3*packedSize)])
	item4Returned := unpackItem(responseBody[4+(3*packedSize) : 4+(4*packedSize)])
	if !compareItem(item1, item1Returned) || !compareItem(item2, item2Returned) || !compareItem(item3, item3Returned) || !compareItem(item4, item4Returned) {
		fmt.Printf("test%s: Returned item(s) is/are not equal to sent item.\n", testNumber)
		return fail()
	}

	return true
}
