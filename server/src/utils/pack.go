/*
 * Authors: Michael Jagiello
 * Created: 2025-10-12
 * Updated: 2025-10-12
 *
 * This file defines functions for turning byte arrays into structs and vice versa to handle receiving/transmitting HTTP response bodies.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package utils

import (
	"openorganizer/src/models"
)

func PackAuth(userAuth models.UserAuth) (response []byte) {
	response = append(response, BigintToBytes(userAuth.UserID)...)
	response = append(response, userAuth.AuthToken...)
	return response
}

func PackLastUpdated(row models.RowLastUpdated) (response []byte) {
	response = append(response, BigintToBytes(row.LastUpNotes)...)
	response = append(response, BigintToBytes(row.LastUpReminders)...)
	response = append(response, BigintToBytes(row.LastUpDaily)...)
	response = append(response, BigintToBytes(row.LastUpWeekly)...)
	response = append(response, BigintToBytes(row.LastUpMonthly)...)
	response = append(response, BigintToBytes(row.LastUpYearly)...)
	response = append(response, BigintToBytes(row.LastUpExtensions)...)
	response = append(response, BigintToBytes(row.LastUpOverrides)...)
	response = append(response, BigintToBytes(row.LastUpFolders)...)
	response = append(response, BigintToBytes(row.LastUpDeleted)...)
	return response
}
