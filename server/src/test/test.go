/*
 * Authors: Michael Jagiello
 * Created: 2025-10-20
 * Updated: 2025-10-26
 *
 * This file is the entry point for the testing suite.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package test

import (
	"fmt"
	"time"

	"openorganizer/src/models"
)

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

	clearAllTables()
	url = "http://localhost:" + env.SERVER_PORT_HTTP + "/"

	// root
	test1()

	// auth
	test2()

	// bad auths
	test3()

	// username testing on register
	test4()

	fmt.Printf("\nTest Suite complete.\n")
	var failures []uint16
	for i, b := range successes {
		if !b {
			failures = append(failures, uint16(i+1))
		}
	}
	fmt.Printf("Passed %v of %v tests.\n", len(successes)-len(failures), len(successes))
	if len(failures) > 0 {
		fmt.Printf("Failed test numbers: ")
		for _, v := range failures {
			fmt.Printf("%v ", v)
		}
		fmt.Printf("\n")
	}
	fmt.Printf("\n")
}
