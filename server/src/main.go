package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {

	// variables

	if err := godotenv.Load(); err != nil {
		fmt.Printf("error loading: %v", err)
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

	// functions

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Connected")
	})

	http.HandleFunc("/login", login)

	// main

	fmt.Printf("Server Port: %s\n", SERVER_PORT)
	fmt.Printf("Database Location: %s:%s@%s\n", DB_HOST, DB_PORT, DB_USER)

	pgConnStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", DB_HOST, DB_PORT, DB_USER, DB_PWD, "postgres")
	conn, err := sql.Open("postgres", pgConnStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	db = conn
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	fmt.Println("Connected to SQL database")

	if error := http.ListenAndServe("localhost:"+SERVER_PORT, nil); error != nil {
		log.Fatalf("Server failed to start")
		return
	}
}

func login(w http.ResponseWriter, r *http.Request) {

	// example code of adding two values
	// x-www-form-urlencoded format

	r.ParseForm()
	a := r.FormValue("a")
	b := r.FormValue("b")

	aInt, err0 := strconv.Atoi(a)
	bInt, err1 := strconv.Atoi(b)

	if (err0 != nil) || (err1 != nil) {
		http.Error(w, "Invalid Input", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "%d + %d = %d", aInt, bInt, aInt+bInt)
}
