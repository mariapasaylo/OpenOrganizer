/*
 * Authors: Michael Jagiello
 * Created: 2025-09-25
 * Updated: 2025-09-25
 *
 * This file defines handlers for receiving syncup requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package services

import (
	"fmt"
	"net/http"
)

func upNotes(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upReminders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersDaily(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upRemindersYearly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upExtensions(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upOverrides(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upFolders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func upDeleted(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncupSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
