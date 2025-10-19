/*
 * Authors: Michael Jagiello
 * Created: 2025-09-25
 * Updated: 2025-10-19
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
	fails, err := db.InsertItems("notes", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpNotes", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upReminders(w http.ResponseWriter, r *http.Request) {
	const upRemindersRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upRemindersRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upRemindersRecordSize)
	fails, err := db.InsertItems("reminders", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpReminders", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upRemindersDaily(w http.ResponseWriter, r *http.Request) {
	const upDailyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upDailyRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upDailyRecordSize)
	fails, err := db.InsertItems("daily_reminders", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpDaily", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	const upWeeklyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upWeeklyRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upWeeklyRecordSize)
	fails, err := db.InsertItems("weekly_reminders", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpWeekly", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	const upMonthlyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upMonthlyRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upMonthlyRecordSize)
	fails, err := db.InsertItems("monthly_reminders", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpMonthly", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upRemindersYearly(w http.ResponseWriter, r *http.Request) {
	const upYearlyRecordSize uint32 = 112
	body, err := readRequestSyncup(w, r, upYearlyRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackItems(body, upYearlyRecordSize)
	fails, err := db.InsertItems("yearly_reminders", rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpYearly", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upExtensions(w http.ResponseWriter, r *http.Request) {
	const upExtensionsRecordSize uint32 = 84
	body, err := readRequestSyncup(w, r, upExtensionsRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackExtensions(body, upExtensionsRecordSize)
	fails, err := db.InsertExtensions(rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpExtensions", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upOverrides(w http.ResponseWriter, r *http.Request) {
	const upOverridesRecordSize uint32 = 88
	body, err := readRequestSyncup(w, r, upOverridesRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackOverrides(body, upOverridesRecordSize)
	fails, err := db.InsertOverrides(rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpOverrides", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upFolders(w http.ResponseWriter, r *http.Request) {
	const upFoldersRecordSize uint32 = 80
	body, err := readRequestSyncup(w, r, upFoldersRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackFolders(body, upFoldersRecordSize)
	fails, err := db.InsertFolders(rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpFolders", rows[0].UserID, rows[0].LastUpdated)
	}

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}

func upDeleted(w http.ResponseWriter, r *http.Request) {
	const upDeletedRecordSize uint32 = 18
	body, err := readRequestSyncup(w, r, upDeletedRecordSize)
	if err != nil {
		return
	}

	userAuth, _ := utils.UnpackSyncupHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows := utils.UnpackDeleted(body, upDeletedRecordSize)
	fails, err := db.InsertDeleted(rows)
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	if len(rows) > 0 {
		db.UpdateLastup("LastUpDeleted", rows[0].UserID, rows[0].LastUpdated)
	}

	// delete items/extensions/overrides using rows

	fmt.Fprintf(w, "%s", utils.PackFails(fails))
}
