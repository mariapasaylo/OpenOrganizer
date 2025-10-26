/*
 * Authors: Michael Jagiello
 * Created: 2025-10-20
 * Updated: 2025-10-25
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
	responseBody, err := send("", requestBody)

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
	responseBody, err := send("register", requestBody)

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
	responseBody, err = send("login", requestBody)

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
