package services

import (
	"fmt"
	"net/http"
)

func downNotes(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downReminders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersDaily(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersWeekly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersMonthly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downRemindersYearly(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downExtensions(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downOverrides(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downFolders(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}

func downDeleted(w http.ResponseWriter, r *http.Request) {
	body, err := readRequest(w, r, syncdownSizeLimit)
	if err != nil {
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
