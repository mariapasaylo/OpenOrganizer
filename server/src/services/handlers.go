package services

import (
	"fmt"
	"io"
	"net/http"
)

const messageSizeLimit = 0x100
const syncupSizeLimit = 0x100000
const syncdownSizeLimit = 0x100

const timeoutMessage = "Content-Length is too high, body is too large, or other read timeout"

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func readRequest(w http.ResponseWriter, r *http.Request, sizeLimit int64) ([]byte, error) {
	enableCors(&w)

	r.Body = http.MaxBytesReader(w, r.Body, sizeLimit)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, timeoutMessage, http.StatusBadRequest)
		return nil, nil
	}

	return body, nil
}

func root(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	fmt.Fprint(w, "connected")
}

func register(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, messageSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func login(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, messageSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func lastSyncup(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, messageSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
