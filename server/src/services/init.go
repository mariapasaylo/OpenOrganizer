/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-09-25
 *
 * This file handles many of the initialization functions, such as pulling .env variables and assigning handlers for HTTP requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package services

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"

	"openorganizer/src/models"
)

// retrieves vital variables from local .env file
func RetrieveENVVars() (env models.ENVVars, err error) {
	if err := godotenv.Load(); err != nil {
		fmt.Printf("error loading: %v\n", err)
		return env, err
	}

	var LOCAL_ONLY = strings.ToUpper(os.Getenv("LOCAL_ONLY"))
	if LOCAL_ONLY == "TRUE" {
		env.LOCAL_ONLY = true
	} else {
		env.LOCAL_ONLY = false
	}

	var HTTPS = strings.ToUpper(os.Getenv("HTTPS"))
	if HTTPS == "TRUE" {
		env.HTTPS = true
	} else if HTTPS == "FALSE" {
		env.HTTPS = false
	} else {
		return env, errors.New("HTTPS is invalid, try TRUE or FALSE")
	}

	var SERVER_PORT = os.Getenv("SERVER_PORT")
	if SERVER_PORT == "" {
		return env, errors.New("SERVER_PORT is null")
	}
	var SERVER_CRT = os.Getenv("SERVER_CRT")
	if env.HTTPS && SERVER_CRT == "" {
		return env, errors.New("SERVER_CRT is null")
	}
	var SERVER_KEY = os.Getenv("SERVER_KEY")
	if env.HTTPS && SERVER_KEY == "" {
		return env, errors.New("SERVER_KEY is null")
	}

	var DB_HOST = os.Getenv("DB_HOST")
	if DB_HOST == "" {
		return env, errors.New("DB_HOST is null")
	}
	var DB_PORT = os.Getenv("DB_PORT")
	if DB_PORT == "" {
		return env, errors.New("DB_HOST is null")
	}
	var DB_USER = os.Getenv("DB_USER")
	if DB_USER == "" {
		return env, errors.New("DB_USER is null")
	}
	var DB_PWD = os.Getenv("DB_PWD")
	if DB_PWD == "" {
		return env, errors.New("DB_PWD is null")
	}

	env.SERVER_PORT = SERVER_PORT
	env.SERVER_CRT = SERVER_CRT
	env.SERVER_KEY = SERVER_KEY
	env.DB_HOST = DB_HOST
	env.DB_PORT = DB_PORT
	env.DB_USER = DB_USER
	env.DB_PWD = DB_PWD

	return env, err
}

// assigns HTTP routes to their respective handling functions
func AssignHandlers() {
	http.HandleFunc("/", root)

	http.HandleFunc("/register", register)
	http.HandleFunc("/login", login)
	http.HandleFunc("/lastsyncup", lastSyncup)

	http.HandleFunc("/syncup/notes", upNotes)
	http.HandleFunc("/syncup/reminders", upReminders)
	http.HandleFunc("/syncup/reminders/daily", upRemindersDaily)
	http.HandleFunc("/syncup/reminders/weekly", upRemindersWeekly)
	http.HandleFunc("/syncup/reminders/monthly", upRemindersMonthly)
	http.HandleFunc("/syncup/reminders/yearly", upRemindersYearly)
	http.HandleFunc("/syncup/extensions", upExtensions)
	http.HandleFunc("/syncup/overrides", upOverrides)
	http.HandleFunc("/syncup/folders", upFolders)
	http.HandleFunc("/syncup/deleted", upDeleted)

	http.HandleFunc("/syncdown/notes", downNotes)
	http.HandleFunc("/syncdown/reminders", downReminders)
	http.HandleFunc("/syncdown/reminders/daily", downRemindersDaily)
	http.HandleFunc("/syncdown/reminders/weekly", downRemindersWeekly)
	http.HandleFunc("/syncdown/reminders/monthly", downRemindersMonthly)
	http.HandleFunc("/syncdown/reminders/yearly", downRemindersYearly)
	http.HandleFunc("/syncdown/extensions", downExtensions)
	http.HandleFunc("/syncdown/overrides", downOverrides)
	http.HandleFunc("/syncdown/folders", downFolders)
	http.HandleFunc("/syncdown/deleted", downDeleted)
}
