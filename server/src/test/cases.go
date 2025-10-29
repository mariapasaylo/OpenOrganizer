/*
 * Authors: Michael Jagiello
 * Created: 2025-10-20
 * Updated: 2025-10-29
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
	"strconv"
	"sync"
	"time"
)

// test MAX_RECORD_COUNT retrieval from /
func test1() bool {
	clearAllTables()
	defer clearAllTables()

	requestBody := []byte{}
	response, responseBody, err := send("", requestBody)

	if !expect("1", response, 200, responseBody, 4, err) {
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
	response, responseBody, err := send("register", requestBody)

	if !expect("2", response, 200, responseBody, 40, err) {
		return fail()
	}
	userID := utils.BytesToBigint(responseBody[0:8])

	requestBody = append(username, password...)
	response, responseBody, err = send("login", requestBody)

	userID2 := utils.BytesToBigint(responseBody[0:8])
	key1Response := responseBody[40:72]
	key2Response := responseBody[72:104]
	if !expect("2", response, 200, responseBody, 104, err) {
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

	if errs > 0 {
		return fail()
	}
	return success()
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
	response, responseBody, err := send("register", requestBody)
	if !expect("3", response, 200, responseBody, 40, err) {
		return fail()
	}

	username2 := pad32([]byte("username2"))
	password2 := pad32([]byte("password2"))

	requestBody = append(username2, password...)
	response, responseBody, err = send("login", requestBody)
	if !expect("3", response, 401, responseBody, -1, err) {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username, password2...)
	response, responseBody, err = send("login", requestBody)
	if !expect("3", response, 401, responseBody, -1, err) {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username2, password2...)
	response, responseBody, err = send("login", requestBody)
	if !expect("3", response, 401, responseBody, -1, err) {
		fmt.Printf("test3: Login succeeded with bad credentials.\n")
		return fail()
	}

	requestBody = append(username, password...)
	response, responseBody, err = send("login", requestBody)
	if !expect("3", response, 200, responseBody, 104, err) {
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
	response, responseBody, err := send("register", requestBody)
	if !expect("4", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[0] = 'u'

	requestBody[8] = '\x00'
	response, responseBody, err = send("register", requestBody)
	if !expect("4", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[8] = ' '

	requestBody[31] = '\x00'
	response, responseBody, err = send("register", requestBody)
	if !expect("4", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[31] = ' '

	// null in password, key1, and key2 should not fail, as these are all raw fields
	requestBody[32] = '\x00'
	requestBody[64] = '\x00'
	requestBody[96] = '\x00'
	response, responseBody, err = send("register", requestBody)
	if !expect("4", response, 200, responseBody, 40, err) {
		return fail()
	}

	return success()
}

// send username with any disallowed characters to login
func test5() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("\x00assword"))
	requestBody := append(username, password...)

	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBodyReg := append(requestBody, key1...)
	requestBodyReg = append(requestBodyReg, key2...)

	response, responseBody, err := send("register", requestBodyReg)
	if !expect("5", response, 200, responseBody, 40, err) {
		return fail()
	}

	// test null
	requestBody[0] = '\x00'
	response, responseBody, err = send("login", requestBody)
	if !expect("5", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[0] = 'u'

	requestBody[8] = '\x00'
	response, responseBody, err = send("login", requestBody)
	if !expect("5", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[8] = ' '

	requestBody[31] = '\x00'
	response, responseBody, err = send("login", requestBody)
	if !expect("5", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[31] = ' '

	// null in password should not fail, as it is a raw field
	response, responseBody, err = send("login", requestBody)
	if !expect("5", response, 200, responseBody, 104, err) {
		return fail()
	}

	return success()
}

// send username with any disallowed characters to changelogin
func test6() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("\x00assword"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBodyReg := append(username, password...)
	requestBodyReg = append(requestBodyReg, key1...)
	requestBodyReg = append(requestBodyReg, key2...)

	response, responseBody, err := send("register", requestBodyReg)
	if !expect("6", response, 200, responseBody, 40, err) {
		return fail()
	}

	usernameNew := pad32([]byte("usernameNew"))
	passwordNew := pad32([]byte("passwordNew"))
	key1New := pad32([]byte("key1New"))
	key2New := pad32([]byte("key2New"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, usernameNew...)
	requestBody = append(requestBody, passwordNew...)
	requestBody = append(requestBody, key1New...)
	requestBody = append(requestBody, key2New...)

	// username

	requestBody[0] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[0] = 'u'

	requestBody[8] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[8] = ' '

	requestBody[31] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[31] = ' '

	// usernameNew

	requestBody[64] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[64] = 'u'

	requestBody[72] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[72] = ' '

	requestBody[95] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 400, responseBody, -1, err) {
		return fail()
	}
	requestBody[95] = ' '

	// null in password, passwordNew, key1New, and key2New should not fail, as these are all raw fields
	requestBody[96] = '\x00'
	requestBody[128] = '\x00'
	requestBody[160] = '\x00'
	response, responseBody, err = send("changelogin", requestBody)
	if !expect("6", response, 200, responseBody, 40, err) {
		return fail()
	}

	return success()
}

// test double register, changelogin, login on old info and login on new info, and registration of previously used username
func test7() bool {
	clearAllTables()
	defer clearAllTables()

	username := pad32([]byte("username"))
	password := pad32([]byte("password"))
	key1 := pad32([]byte("key1"))
	key2 := pad32([]byte("key2"))
	requestBodyReg := append(username, password...)
	requestBodyReg = append(requestBodyReg, key1...)
	requestBodyReg = append(requestBodyReg, key2...)

	response, responseBody, err := send("register", requestBodyReg)
	if !expect("7", response, 200, responseBody, 40, err) {
		return fail()
	}
	userID := utils.BytesToBigint(responseBody[0:8])

	response, responseBody, err = send("register", requestBodyReg)
	if !expect("7", response, 401, responseBody, -1, err) {
		return fail()
	}

	usernameNew := pad32([]byte("usernameNew"))
	passwordNew := pad32([]byte("passwordNew"))
	key1New := pad32([]byte("key1New"))
	key2New := pad32([]byte("key2New"))
	requestBody := append(username, password...)
	requestBody = append(requestBody, usernameNew...)
	requestBody = append(requestBody, passwordNew...)
	requestBody = append(requestBody, key1New...)
	requestBody = append(requestBody, key2New...)

	response, responseBody, err = send("changelogin", requestBody)
	if !expect("7", response, 200, responseBody, 40, err) {
		return fail()
	}
	userID2 := utils.BytesToBigint(responseBody[0:8])

	response, responseBody, err = send("login", requestBodyReg[0:64])
	if !expect("7", response, 401, responseBody, -1, err) {
		return fail()
	}

	requestBody = append(usernameNew, passwordNew...)
	response, responseBody, err = send("login", requestBody)
	if !expect("7", response, 200, responseBody, 104, err) {
		return fail()
	}
	userID3 := utils.BytesToBigint(responseBody[0:8])
	key1Response := responseBody[40:72]
	key2Response := responseBody[72:104]

	var errs int = 0
	if userID != userID2 {
		fmt.Printf("test7: Expected userID %v does not match with received userID of %v.\n", userID, userID2)
		errs += 1
	}
	if userID != userID3 {
		fmt.Printf("test7: Expected userID %v does not match with received userID of %v.\n", userID, userID2)
		errs += 1
	}
	if !slices.Equal(key1New, key1Response) {
		fmt.Printf("test7: Expected key1 %s does not match with received key1 of %s.\n", key1New, key1Response)
		errs += 1
	}
	if !slices.Equal(key2New, key2Response) {
		fmt.Printf("test7: Expected key2 %s does not match with received key2 of %s.\n", key2New, key2Response)
		errs += 1
	}

	response, responseBody, err = send("register", requestBodyReg)
	if !expect("7", response, 200, responseBody, 40, err) {
		return fail()
	}
	response, responseBody, err = send("login", requestBodyReg[0:64])
	if !expect("7", response, 200, responseBody, 104, err) {
		return fail()
	}

	if errs > 0 {
		return fail()
	}
	return success()
}

// retrieve lastUpdated and verify all returned values are equal
func test8() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	response, responseBody, err := send("lastupdated", authHeader)
	if !expect("8", response, 200, responseBody, 80, err) {
		return fail()
	}

	var lastUpList []int64
	for i := range len(responseBody) / 8 {
		currentValue := utils.BytesToBigint(responseBody[i*8 : i*8+8])
		lastUpList = append(lastUpList, currentValue)
	}

	for i := range len(lastUpList) - 1 {
		if lastUpList[i] != lastUpList[i+1] {
			return fail()
		}
	}
	return success()
}

// note syncing
func test9() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("9", 128, "notes", authHeader) {
		return fail()
	}
	return success()
}

// reminder syncing
func test10() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("10", 96, "reminders", authHeader) {
		return fail()
	}
	return success()
}

// daily reminder syncing
func test11() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("11", 96, "reminders/daily", authHeader) {
		return fail()
	}
	return success()
}

// weekly reminder syncing
func test12() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("12", 96, "reminders/weekly", authHeader) {
		return fail()
	}
	return success()
}

// monthly reminder syncing
func test13() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("13", 96, "reminders/monthly", authHeader) {
		return fail()
	}
	return success()
}

// yearly reminder syncing
func test14() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("14", 96, "reminders/yearly", authHeader) {
		return fail()
	}
	return success()
}

// extensions syncing
func test15() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("15", 4+64, "extensions", authHeader) {
		return fail()
	}
	return success()
}

// overrides syncing
func test16() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("16", 8+64, "overrides", authHeader) {
		return fail()
	}
	return success()
}

// folders syncing
func test17() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("17", 0+64, "folders", authHeader) {
		return fail()
	}
	return success()
}

// deleted syncing
func test18() bool {
	clearAllTables()
	defer clearAllTables()

	authHeader, err := simpleAuthSetup()
	if utils.PrintErrorLine(err) {
		return fail()
	}

	if !simpleSync("18", 2+0, "deleted", authHeader) {
		return fail()
	}
	return success()
}

// all endpoints trying too long and too short
// also tests making content-length header too long / too short compared to the body and compared to what is expected
func test19() bool {
	clearAllTables()
	defer clearAllTables()

	var endpoints []string = []string{
		"register", "login", "changelogin", "lastupdated",

		"syncup/notes", "syncup/reminders",
		"syncup/reminders/daily", "syncup/reminders/weekly", "syncup/reminders/monthly", "syncup/reminders/yearly",
		"syncup/extensions", "syncup/overrides", "syncup/folders", "syncup/deleted",

		"syncdown/notes", "syncdown/reminders",
		"syncdown/reminders/daily", "syncdown/reminders/weekly", "syncdown/reminders/monthly", "syncdown/reminders/yearly",
		"syncdown/extensions", "syncdown/overrides", "syncdown/folders", "syncdown/deleted"}
	// sending 2 records per syncup for expected lengths
	var expectedLengths []int = []int{
		128, 64, 192, 40,
		332, 268,
		268, 268, 268, 268,
		212, 220, 204, 80,
		56, 56,
		56, 56, 56, 56,
		56, 56, 56, 56}

	results := make([]bool, len(endpoints)*15)
	var recordCount int32 = 2

	setupPayload := func(expectedLength int) (payload []byte) {
		payload = make([]byte, expectedLength)
		for i := range payload {
			payload[i] = '1'
		}
		if expectedLength > 44 {
			copy(payload[40:44], utils.IntToBytes(int32(recordCount)))
		}
		return payload
	}

	var waitGroup sync.WaitGroup
	for i := range endpoints {
		for j := -2; j <= 2; j++ {
			waitGroup.Add(1)
			go func() {
				defer waitGroup.Done()
				payload := setupPayload(expectedLengths[i] - 1)
				response, _, err := send(endpoints[i], payload, "Content-Length", strconv.Itoa(expectedLengths[i]+j))
				if response.StatusCode == 400 {
					results[15*i+2+j] = true
				} else {
					fmt.Printf("%v,%v : %s | Expected status 400\n", i, j, response.Status)
					results[15*i+2+j] = false
				}
				utils.PrintErrorLine(err)
			}()
			time.Sleep(5 * time.Millisecond)
			waitGroup.Add(1)
			go func() {
				defer waitGroup.Done()
				payload := setupPayload(expectedLengths[i] + 1)
				response, _, err := send(endpoints[i], payload, "Content-Length", strconv.Itoa(expectedLengths[i]+j))
				if response.StatusCode == 400 {
					results[15*i+7+j] = true
				} else {
					fmt.Printf("%v,%v : %s | Expected status 400\n", i, j, response.Status)
					results[15*i+7+j] = false
				}
				utils.PrintErrorLine(err)
			}()
			time.Sleep(5 * time.Millisecond)
			waitGroup.Add(1)
			go func() {
				defer waitGroup.Done()
				payload := setupPayload(expectedLengths[i])
				response, _, err := send(endpoints[i], payload, "Content-Length", strconv.Itoa(expectedLengths[i]+j))
				if response.StatusCode != 400 {
					results[15*i+12+j] = true
				} else {
					fmt.Printf("%v,%v : %s | Expected status 400\n", i, j, response.Status)
					results[15*i+12+j] = false
				}
				utils.PrintErrorLine(err)
			}()
			time.Sleep(5 * time.Millisecond)
		}
	}

	waitGroup.Wait()
	for _, val := range results {
		if !val {
			return fail()
		}
	}

	return success()
}
