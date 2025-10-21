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
	"bytes"
	"fmt"
	"io"
	"net/http"
	"time"

	"openorganizer/src/db"
	"openorganizer/src/models"
	"openorganizer/src/utils"
)

var env models.ENVVars

func TestSuite(envData models.ENVVars) {
	env = envData
	time.Sleep(1.0 * time.Second)
	fmt.Printf(
		`
Test Suite is enabled, running.
WARNING: TEST SUITE WILL DROP ALL TABLES IN THE ATTACHED DATABASE.
PROCESS WILL NOT START FOR %v SECONDS.
PLEASE TERMINATE THE PROGRAM BEFORE THIS TIME ELAPSES IF YOU WOULD LIKE TO PRESERVE STORED DATA.

`, env.TEST_SUITE_DELAY)
	time.Sleep(time.Duration(env.TEST_SUITE_DELAY) * time.Second)
	fmt.Printf("Test Suite initiated.\n\n")

	envDropTables := models.ENVVars{
		CLEAR_DB_AUTH: true,
		CLEAR_DB_DATA: true,
	}
	db.EnsureDBTables(envDropTables)

	url := "http://localhost:" + env.SERVER_PORT_HTTP + "/"
	payload := []byte{}
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		fmt.Printf("%v\n", err)
	}
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Printf("%v\n", err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("%v\n", err)
	}
	fmt.Printf("recordCountBuf: %s\n", body)
	fmt.Printf("recordCountVal: %v\n", uint32(utils.BytesToInt(body)))

	fmt.Printf("\nTest Suite complete.\n")
}
