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
