/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-11
 *
 * This file declares general utilities that are useful helper functions across many areas.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package utils

// add non-nil error to chan of errors
func AddError(err error, errs chan error) {
	if err != nil {
		errs <- err
	}
}
