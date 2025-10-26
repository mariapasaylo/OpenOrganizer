/*
 * Authors: Michael Jagiello
 * Created: 2025-10-20
 * Updated: 2025-10-26
 *
 * This file has the test cases.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package test

import (
	"fmt"
	"openorganizer/src/utils"
	"slices"
)

// test MAX_RECORD_COUNT retrieval from /
func test1() bool {
	clearAllTables()
	defer clearAllTables()

	requestBody := []byte{}
	_, responseBody, err := send("", requestBody)

	if utils.PrintErrorLine(err) {
		return fail()
	}
	if len(responseBody) != 4 {
		fmt.Printf("test1: Expected response body length 4 does not match with received length of %v.\n", len(responseBody))
		return fail()
	}
	maxRecordCount := uint32(utils.BytesToInt(responseBody))
	if maxRecordCount == env.MAX_RECORD_COUNT {
		return success()
	}
	fmt.Printf("test1: Expected response body does not match with received body of \"%s\".\n", responseBody)
	return fail()
}

// register for an account and log in
func test2() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("password"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, key1...)
	requestBody = append(requestBody, key2...)
	_, responseBody, err := send("register", requestBody)

	if utils.PrintErrorLine(err) {
		return fail()
	}
	if len(responseBody) != 40 {
		fmt.Printf("test2: Expected response body length 40 does not match with received length of %v.\n", len(responseBody))
		fmt.Printf("%s", responseBody)
		return fail()
	}
	userID := utils.BytesToBigint(responseBody[0:8])

	requestBody = append(username, password...)
	_, responseBody, err = send("login", requestBody)

	userID2 := utils.BytesToBigint(responseBody[0:8])
	key1Response := responseBody[40:72]
	key2Response := responseBody[72:104]
	if utils.PrintErrorLine(err) {
		return fail()
	}
	if len(responseBody) != 104 {
		fmt.Printf("test2: Expected response body length 104 does not match with received length of %v.\n", len(responseBody))
		return fail()
	}
	var errs int = 0
	if userID != userID2 {
		fmt.Printf("test2: Expected userID %v does not match with received userID of %v.\n", userID, userID2)
		errs += 1
	}
	if !slices.Equal(key1, key1Response) {
		fmt.Printf("test2: Expected key1 %s does not match with received key1 of %s.\n", key1, key1Response)
		errs += 1
	}
	if !slices.Equal(key2, key2Response) {
		fmt.Printf("test2: Expected key2 %s does not match with received key2 of %s.\n", key2, key2Response)
		errs += 1
	}

	if errs == 0 {
		return success()
	}
	return fail()
}

// register for an account, try to log in with bad usernames and bad passwords
func test3() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("password"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, key1...)
	requestBody = append(requestBody, key2...)
	_, responseBody, err := send("register", requestBody)

	if utils.PrintErrorLine(err) {
		return fail()
	}
	if len(responseBody) != 40 {
		fmt.Printf("test3: Expected response body length 40 does not match with received length of %v.\n", len(responseBody))
		fmt.Printf("%s", responseBody)
		return fail()
	}

	username2 := pad32([]byte("username2"))
	password2 := pad32([]byte("password2"))

	requestBody = append(username2, password...)
	_, _, err = send("login", requestBody)
	if err == nil {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username, password2...)
	_, _, err = send("login", requestBody)
	if err == nil {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username2, password2...)
	_, _, err = send("login", requestBody)
	if err == nil {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username, password...)
	_, _, err = send("login", requestBody)
	if utils.PrintErrorLine(err) {
		return fail()
	}

	return success()
}

// send username with any disallowed characters to register
func test4() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("password"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, key1...)
	requestBody = append(requestBody, key2...)

	// test null
	requestBody[0] = '\x00'
	response, _, _ := send("register", requestBody)
	if response.StatusCode != 400 {
		fmt.Printf("test4: Expected status code 400, received %v.\n", response.StatusCode)
		return fail()
	}
	requestBody[0] = 'u'

	requestBody[8] = '\x00'
	response, _, _ = send("register", requestBody)
	if response.StatusCode != 400 {
		fmt.Printf("test4: Expected status code 400, received %v.\n", response.StatusCode)
		return fail()
	}
	requestBody[8] = ' '

	requestBody[31] = '\x00'
	response, _, _ = send("register", requestBody)
	if response.StatusCode != 400 {
		fmt.Printf("test4: Expected status code 400, received %v.\n", response.StatusCode)
		return fail()
	}
	requestBody[31] = ' '

	// null in password, key1 and key2 should not fail, as these are all raw fields
	requestBody[32] = '\x00'
	requestBody[64] = '\x00'
	requestBody[96] = '\x00'
	_, _, err := send("register", requestBody)
	if utils.PrintErrorLine(err) {
		return fail()
	}

	return success()
}
