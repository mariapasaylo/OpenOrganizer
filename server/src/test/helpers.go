/*
 * Authors: Michael Jagiello
 * Created: 2025-10-25
 * Updated: 2025-10-26
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
	"io"
	"net/http"
	"openorganizer/src/db"
	"openorganizer/src/models"
	"openorganizer/src/utils"
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

// send to server endpoint

func send(endpoint string, requestBody []byte) (response *http.Response, responseBody []byte, err error) {
	response, err = http.Post(url+endpoint, "", bytes.NewBuffer(requestBody))
	if err != nil {
		return response, responseBody, err
	}
	utils.PrintErrorLine(err)
	defer response.Body.Close()
	responseBody, err = io.ReadAll(response.Body)
	if err != nil {
		return response, responseBody, err
	}
	utils.PrintErrorLine(err)
	if response.StatusCode != 200 {
		return response, responseBody, errors.New(response.Status + " | " + string(responseBody))
	}
	return response, responseBody, nil
}
