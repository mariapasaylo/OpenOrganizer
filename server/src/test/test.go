/*
 * Authors: Michael Jagiello
 * Created: 2025-10-20
 * Updated: 2025-10-20
 *
 * This file is the entry point to the server.
 * It handles the large scope of the order of operations for initialization and serving requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package test

import (
	"fmt"
	"time"

	"openorganizer/src/db"
	"openorganizer/src/models"
)

var envClearAll = models.ENVVars{
	CLEAR_DB_AUTH: true,
	CLEAR_DB_DATA: true,
}
var envClearAuth = models.ENVVars{
	CLEAR_DB_AUTH: true,
	CLEAR_DB_DATA: false,
}
var envClearData = models.ENVVars{
	CLEAR_DB_AUTH: false,
	CLEAR_DB_DATA: true,
}

var env models.ENVVars
var url string

var successes []bool

func TestSuite(envData models.ENVVars) {
	env = envData
	time.Sleep(1.0 * time.Second)
	fmt.Printf(
		`
Test Suite is enabled, running.
WARNING: TEST SUITE WILL DROP ALL TABLES IN THE ATTACHED DATABASE.
TESTING WILL NOT START FOR %v SECONDS.
PLEASE TERMINATE THE PROGRAM BEFORE THIS TIME ELAPSES IF YOU WOULD LIKE TO PRESERVE STORED DATA.

`, env.TEST_SUITE_DELAY)
	time.Sleep(time.Duration(env.TEST_SUITE_DELAY) * time.Second)
	fmt.Printf("Test Suite initiated.\n\n")

	db.EnsureDBTables(envClearAll)
	url = "http://localhost:" + env.SERVER_PORT_HTTP + "/"

	test1()

	fmt.Printf("\nTest Suite complete.\n")
	var failures []uint16
	for i, b := range successes {
		if !b {
			failures = append(failures, uint16(i+1))
		}
	}
	fmt.Printf("Passed %v of %v tests.\n", len(successes)-len(failures), len(successes))
	if len(failures) > 0 {
		fmt.Printf("Failed tests: ")
		for _, v := range failures {
			fmt.Printf("%v ", v)
		}
		fmt.Printf("\n")
	}
	fmt.Printf("\n")
}

func success() bool {
	successes = append(successes, true)
	return true
}

func fail() bool {
	successes = append(successes, false)
	return false
}
