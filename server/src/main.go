package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"openorganizer/src/services"
)

func main() {

	// loading vital variables

	if err := godotenv.Load(); err != nil {
		fmt.Printf("error loading: %v\n", err)
		return
	}

	var SERVER_PORT = os.Getenv("SERVER_PORT")
	if SERVER_PORT == "" {
		log.Fatalf("SERVER_PORT is null")
		return
	}
	var DB_HOST = os.Getenv("DB_HOST")
	if DB_HOST == "" {
		log.Fatalf("DB_HOST is null")
		return
	}
	var DB_PORT = os.Getenv("DB_PORT")
	if DB_PORT == "" {
		log.Fatalf("DB_PORT is null")
		return
	}
	var DB_USER = os.Getenv("DB_USER")
	if DB_USER == "" {
		log.Fatalf("DB_USER is null")
		return
	}
	var DB_PWD = os.Getenv("DB_PWD")
	if DB_PWD == "" {
		log.Fatalf("DB_PWD is null")
		return
	}

	// http connection handling functions

	http.HandleFunc("/", services.Root)

	// CRUD (currently in urlencoded form)

	http.HandleFunc("/create", services.Create)
	http.HandleFunc("/read", services.Read)
	http.HandleFunc("/update", services.Update)
	http.HandleFunc("/delete", services.Delete)

	// handling types

	http.HandleFunc("/formdata", services.Formdata)
	http.HandleFunc("/raw", services.Raw)

	// main

	fmt.Printf("Server Port: %s\n", SERVER_PORT)
	fmt.Printf("Database Location: %s:%s@%s\n", DB_HOST, DB_PORT, DB_USER)

	// opening postgres connection

	pgConnStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", DB_HOST, DB_PORT, DB_USER, DB_PWD, "postgres")
	conn, err := sql.Open("postgres", pgConnStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	services.DB = conn
	defer services.DB.Close()
	if err := services.DB.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	fmt.Println("Connected to SQL database")

	//services.DB.Exec("DROP TABLE example;")

	createExampleTableSQL := `
		CREATE TABLE IF NOT EXISTS example (
			id VARCHAR(32),
            value VARCHAR(32)
        );`
	_, err = services.DB.Exec(createExampleTableSQL)
	if err != nil {
		fmt.Printf("Error creating table: %v\n", err)
		return
	}

	if error := http.ListenAndServe("localhost:"+SERVER_PORT, nil); error != nil {
		log.Fatalf("Server failed to start")
		return
	}
}
