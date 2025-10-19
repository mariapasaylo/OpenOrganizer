/*
 * Authors: Michael Jagiello
 * Created: 2025-09-25
 * Updated: 2025-10-18
 *
 * This file defines handlers for receiving syncup requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package services

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net/http"
	"openorganizer/src/db"
	"openorganizer/src/utils"
)

// reads in data and validates that the header + records is the correct size
func readRequestSyncup(w http.ResponseWriter, r *http.Request, recordSize uint32) ([]byte, error) {
	enableCors(&w)
	const syncupHeaderSize = 44

	var maxSyncupSize = syncupHeaderSize + (maxRecordCount * recordSize)
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxSyncupSize))
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, timeoutMessage, http.StatusBadRequest)
		return nil, errors.New("")
	}

	if r.ContentLength < 44 {
		http.Error(w, "content length header does not match expected body size", http.StatusBadRequest)
		return nil, errors.New("")
	}
	var recordCount uint32 = binary.LittleEndian.Uint32(body[40:44])
	if !verifyRequestSize(w, r, syncupHeaderSize, recordSize, recordCount) {
		return nil, errors.New("")
	}

	return body, nil
}

// bound HTTP handlers

func upNotes(w http.ResponseWriter, r *http.Request) {
	const upNotesRecordSize uint32 = 144
	body, err := readRequestSyncup(w, r, upNotesRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upNotesRecordSize)
	fails := db.InsertItems("notes", rows)

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upReminders(w http.ResponseWriter, r *http.Request) {
	const upRemindersRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upRemindersRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersDaily(w http.ResponseWriter, r *http.Request) {
	const upDailyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upDailyRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	const upWeeklyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upWeeklyRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	const upMonthlyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upMonthlyRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersYearly(w http.ResponseWriter, r *http.Request) {
	const upYearlyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upYearlyRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upExtensions(w http.ResponseWriter, r *http.Request) {
	const upExtensionsRecordSize uint32 = 84
	body, err := readRequestSyncup(w, r, upExtensionsRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upOverrides(w http.ResponseWriter, r *http.Request) {
	const upOverridesRecordSize uint32 = 88
	body, err := readRequestSyncup(w, r, upOverridesRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upFolders(w http.ResponseWriter, r *http.Request) {
	const upFoldersRecordSize uint32 = 80
	body, err := readRequestSyncup(w, r, upFoldersRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upDeleted(w http.ResponseWriter, r *http.Request) {
	const upDeletedRecordSize uint32 = 18
	body, err := readRequestSyncup(w, r, upDeletedRecordSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
