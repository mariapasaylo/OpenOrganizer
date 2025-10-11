/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-09-20
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
	"fmt"
	"openorganizer/src/models"
)

var db *sql.DB

// connects to the postgresql server using provided env variables
func ConnectToDB(env models.ENVVars) error {
	pgConnStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", env.DB_HOST, env.DB_PORT, env.DB_USER, env.DB_PWD, "postgres")
	conn, err := sql.Open("postgres", pgConnStr)
	if err != nil {
		return err
	}
	db = conn
	err = db.Ping()
	return err
}

// creates all required db tables that do not already exist
func EnsureDBTables() error {
	//services.DB.Exec("DROP TABLE example;")
	_, err := db.Exec(createExampleTableSQL)
	return err
}

// defer this function in main to close the database connection after program termination
func CloseDatabase() {
	db.Close()
}

// SQL execution functions

func Create(k string, v string) error {
	_, err := db.Query(sqlCreate(k, v))
	return err
}

func Read(k string) (values []string, err error) {
	rows, err := db.Query(sqlRead(k))
	if err != nil {
		return values, err
	}
	defer rows.Close()

	for rows.Next() {
		var key string
		var value string
		if err := rows.Scan(&key, &value); err != nil {
			return values, err
		}
		values = append(values, value)
	}

	return values, err
}

func Update(k string, v string) error {
	_, err := db.Query(sqlUpdate(k, v))
	return err
}

func Delete(k string) error {
	_, err := db.Query(sqlDelete(k))
	return err
}
