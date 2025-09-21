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
