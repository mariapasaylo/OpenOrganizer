/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-10-09
 *
 * This file defines handlers for non-syncing requests, helper functions, and general services const values.
 * The other handler files use const values and helper functions defined here.
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
	"net"
	"net/http"
	"strconv"

	"openorganizer/src/models"
)

const messageSizeLimit = 0x100
const timeoutMessage = "Content-Length is too high, body is too large, or other read timeout"

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func redirectHTTPS(w http.ResponseWriter, r *http.Request, env models.ENVVars) {
	host, _, _ := net.SplitHostPort(r.Host)
	url := r.URL
	url.Scheme = "https"
	url.Host = net.JoinHostPort(host, env.SERVER_PORT_HTTPS)
	http.Redirect(w, r, url.String(), http.StatusPermanentRedirect)
}

func verifyRequestSize(w http.ResponseWriter, r *http.Request, headerSize uint32, recordSize uint32, recordCount uint32) bool {
	if recordCount > maxRecordCount {
		http.Error(w, "recordCount higher than server limit of "+strconv.Itoa(int(maxRecordCount)), http.StatusBadRequest)
		return false
	}
	var expectedSize = headerSize + (recordSize * recordCount)
	if r.ContentLength == int64(expectedSize) {
		return true
	}
	http.Error(w, "content length header does not match expected body size", http.StatusBadRequest)
	return false
}

func readRequestGeneral(w http.ResponseWriter, r *http.Request, headerSize uint32) ([]byte, error) {
	enableCors(&w)

	r.Body = http.MaxBytesReader(w, r.Body, messageSizeLimit)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, timeoutMessage, http.StatusBadRequest)
		return nil, errors.New("")
	}
	if !verifyRequestSize(w, r, headerSize, 0, 0) {
		return nil, errors.New("")
	}

	return body, nil
}

// bound HTTP handlers

func root(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	fmt.Fprintf(w, "%v", maxRecordCount)
}

func register(w http.ResponseWriter, r *http.Request) {
	const headerSize = 128
	body, err := readRequestGeneral(w, r, headerSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func login(w http.ResponseWriter, r *http.Request) {
	const headerSize = 64
	body, err := readRequestGeneral(w, r, headerSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func changeLogin(w http.ResponseWriter, r *http.Request) {
	const headerSize = 192
	body, err := readRequestGeneral(w, r, headerSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func lastUpdated(w http.ResponseWriter, r *http.Request) {
	const headerSize = 40
	body, err := readRequestGeneral(w, r, headerSize)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
