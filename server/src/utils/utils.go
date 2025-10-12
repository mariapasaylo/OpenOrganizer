/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-12
 *
 * This file declares general utilities that are useful helper functions across many areas.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package utils

import (
	"crypto/rand"
	"time"
)

// add non-nil error to chan of errors
func AddError(err error, errs chan error) {
	if err != nil {
		errs <- err
	}
}

func Now() int64 {
	return time.Now().UnixMilli()
}

func RandArray(length int32) []byte {
	array := make([]byte, length)
	rand.Read(array)
	return array
}
