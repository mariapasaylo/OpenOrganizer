/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-10-18
 *
 * This file declares the database variable and includes databse interaction functions.
 * Included are for connecting to and closing the connection to the database, as well as functions for inserting into or selecting from.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package db

import (
	"database/sql"
	"errors"
	"fmt"

	"openorganizer/src/models"
	"openorganizer/src/utils"
)

var db *sql.DB
var tokenExpireTime uint32

// connects to the postgresql server using provided env variables
func ConnectToDB(env models.ENVVars) error {
	pgConnStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", env.DB_HOST, env.DB_PORT, env.DB_USER, env.DB_PWD, "postgres")
	conn, err := sql.Open("postgres", pgConnStr)
	if err != nil {
		return err
	}
	db = conn
	err = db.Ping()

	tokenExpireTime = env.TOKEN_EXPIRE_TIME

	return err
}

// creates all required db tables that do not already exist
func EnsureDBTables(dropAll bool) chan error {
	var errs = make(chan error)

	if dropAll {
		_, err := db.Exec(dropAllTables)
		utils.AddError(err, errs)
	}

	_, err := db.Exec(createTableUsers)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableTokens)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableLastUpdated)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("notes"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("reminders"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("daily_reminders"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("weekly_reminders"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("monthly_reminders"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableItems("yearly_reminders"))
	utils.AddError(err, errs)
	_, err = db.Exec(createTableExtensions)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableOverrides)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableFolders)
	utils.AddError(err, errs)
	_, err = db.Exec(createTableDeleted)
	utils.AddError(err, errs)

	return errs
}

// defer this function in main to close the database connection after program termination
func CloseDatabase() {
	db.Close()
}

// general non-account / authentication or syncing functions

func GetLastUpdated(userID int64) (row models.RowLastUpdated, err error) {
	rows, err := db.Query(lastupRead, userID)
	if err != nil {
		return models.RowLastUpdated{}, err
	}
	defer rows.Close()
	if !rows.Next() {
		return models.RowLastUpdated{}, errors.New("")
	}
	_ = rows.Scan(&row.UserID, &row.LastUpNotes, &row.LastUpReminders,
		&row.LastUpDaily, &row.LastUpWeekly, &row.LastUpMonthly, &row.LastUpYearly,
		&row.LastUpExtensions, &row.LastUpOverrides, &row.LastUpFolders, &row.LastUpDeleted)
	return row, nil
}
