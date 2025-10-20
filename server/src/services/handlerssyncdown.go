/*
 * Authors: Michael Jagiello
 * Created: 2025-09-25
 * Updated: 2025-10-18
 *
 * This file defines handlers for receiving syncdown requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package services

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"openorganizer/src/db"
	"openorganizer/src/utils"
)

func readRequestSyncdown(w http.ResponseWriter, r *http.Request) ([]byte, error) {
	enableCors(&w)
	const syncdownHeaderSize = 56

	r.Body = http.MaxBytesReader(w, r.Body, syncdownHeaderSize)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, timeoutMessage, http.StatusBadRequest)
		return nil, errors.New("")
	}
	if !verifyRequestSize(w, r, syncdownHeaderSize, 0, 0) {
		return nil, errors.New("")
	}

	return body, nil
}

// bound HTTP handlers

func downNotes(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 128
	rows, _ := db.GetItemRows("notes", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downReminders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 96
	rows, _ := db.GetItemRows("reminders", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downRemindersDaily(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 96
	rows, _ := db.GetItemRows("daily_reminders", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 96
	rows, _ := db.GetItemRows("weekly_reminders", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 96
	rows, _ := db.GetItemRows("monthly_reminders", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downRemindersYearly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 96
	rows, _ := db.GetItemRows("yearly_reminders", userAuth.UserID, startTime, endTime)
	response, err := utils.PackItems(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downExtensions(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 64
	rows, _ := db.GetExtensionRows(userAuth.UserID, startTime, endTime)
	response, err := utils.PackExtensions(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downOverrides(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 64
	rows, _ := db.GetOverrideRows(userAuth.UserID, startTime, endTime)
	response, err := utils.PackOverrides(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downFolders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	const expectedEncrDataSize = 64
	rows, _ := db.GetFolderRows(userAuth.UserID, startTime, endTime)
	response, err := utils.PackFolders(rows, expectedEncrDataSize)
	if err != nil {
		http.Error(w, "one or more rows had the incorrect encrypted data size", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", response)
}

func downDeleted(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	userAuth, startTime, endTime := utils.UnpackSyncdownHeader(body)
	if !db.CheckTokenAuth(userAuth) {
		http.Error(w, "Invalid userID+token combination.", http.StatusUnauthorized)
		return
	}

	rows, _ := db.GetDeletedRows(userAuth.UserID, startTime, endTime)
	response := utils.PackDeleted(rows)

	fmt.Fprintf(w, "%s", response)
}
