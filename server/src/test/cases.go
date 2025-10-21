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
	"io"
	"net/http"
	"openorganizer/src/utils"
)

// test MAX_RECORD_COUNT retrieval from /
func test1() bool {
	payload := []byte{}
	response, err := http.Post(url, "", bytes.NewBuffer(payload))
	utils.PrintErrorLine(err)
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	utils.PrintErrorLine(err)

	if len(body) != 4 {
		return fail()
	}
	maxRecordCount := uint32(utils.BytesToInt(body))
	if maxRecordCount == env.MAX_RECORD_COUNT {
		return success()
	}
	return fail()
}
