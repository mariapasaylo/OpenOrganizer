/*
 * Authors: Michael Jagiello
 * Created: 2025-09-25
 * Updated: 2025-10-09
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

	fmt.Fprintf(w, "read:\n%s", body)
}

func downReminders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersDaily(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersYearly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downExtensions(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downOverrides(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downFolders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downDeleted(w http.ResponseWriter, r *http.Request) {
	body, err := readRequestSyncdown(w, r)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
