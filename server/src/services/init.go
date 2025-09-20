package services

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"openorganizer/src/models"
)

// retrieves vital variables from local .env file
func RetrieveENVVars() (env models.ENVVars, err error) {
	if err := godotenv.Load(); err != nil {
		fmt.Printf("error loading: %v\n", err)
		return env, err
	}

	var SERVER_PORT = os.Getenv("SERVER_PORT")
	if SERVER_PORT == "" {
		return env, errors.New("SERVER_PORT is null")
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
	env.DB_HOST = DB_HOST
	env.DB_PORT = DB_PORT
	env.DB_USER = DB_USER
	env.DB_PWD = DB_PWD

	return env, err
}

// assigns HTTP routes to their respective handling functions
func AssignHandlers() {
	// http connection handling functions

	http.HandleFunc("/", Root)

	// CRUD (currently in urlencoded form)

	http.HandleFunc("/create", Create)
	http.HandleFunc("/read", Read)
	http.HandleFunc("/update", Update)
	http.HandleFunc("/delete", Delete)

	// handling types

	http.HandleFunc("/formdata", Formdata)
	http.HandleFunc("/raw", Raw)
}

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
	createExampleTableSQL := `
		CREATE TABLE IF NOT EXISTS example (
			id VARCHAR(32),
			value VARCHAR(32)
		);`
	_, err := db.Exec(createExampleTableSQL)
	return err
}

// defer this function in main to close the database connection after program termination
func CloseDatabase() {
	db.Close()
}
