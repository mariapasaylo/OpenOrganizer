package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func UNUSED(x ...any) {}

var db *sql.DB

func main() {

	// loading vital variables

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

	// http connection handling functions

	http.HandleFunc("/", root)
	http.HandleFunc("/create", create)
	http.HandleFunc("/read", read)

	// main

	fmt.Printf("Server Port: %s\n", SERVER_PORT)
	fmt.Printf("Database Location: %s:%s@%s\n", DB_HOST, DB_PORT, DB_USER)

	// opening postgres connection

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

	//db.Exec("DROP TABLE example;")

	createExampleTableSQL := `
		CREATE TABLE IF NOT EXISTS example (
			id VARCHAR(32),
            value VARCHAR(32)
        );`
	_, err = db.Exec(createExampleTableSQL)
	if err != nil {
		fmt.Printf("Error creating table: %v\n", err)
		return
	}

	if error := http.ListenAndServe("localhost:"+SERVER_PORT, nil); error != nil {
		log.Fatalf("Server failed to start")
		return
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func root(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	fmt.Fprint(w, "connected")
}

func create(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")
	v := r.FormValue("v")

	if (k == "") || (v == "") {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if (len(k) > 32) || (len(v) > 32) {
		http.Error(w, "string(s) too long", http.StatusBadRequest)
		return
	}

	storeToTableSQL := "INSERT INTO example (id, value) VALUES ('" + k + "','" + v + "');"
	_, err := db.Query(storeToTableSQL)
	if err != nil {
		fmt.Printf("error inserting into table: %v\n", err)
		return
	}

	fmt.Fprintf(w, "stored '%s', '%s'", k, v)
}

func read(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")

	if k == "" {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if len(k) > 32 {
		http.Error(w, "string too long", http.StatusBadRequest)
		return
	}

	loadFromTableSQL := "SELECT * FROM example WHERE id = '" + k + "'"
	rows, err := db.Query(loadFromTableSQL)
	if err != nil {
		fmt.Printf("Error creating table: %v\n", err)
		return
	}
	defer rows.Close()

	var values []string

	for rows.Next() {
		var key string
		var value string
		if err := rows.Scan(&key, &value); err != nil {
			fmt.Fprintf(w, "error")
			return
		}
		values = append(values, value)
	}
	if err = rows.Err(); err != nil {
		fmt.Fprintf(w, "error")
		return
	}

	if len(values) == 0 {
		fmt.Fprintf(w, "no values found under id = %s", k)
		return
	}

	fmt.Fprintf(w, "retrieved '%s' using '%s'\n", values[0], k)
}
