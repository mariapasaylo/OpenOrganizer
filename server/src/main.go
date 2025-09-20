package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"

	"openorganizer/src/db"
	"openorganizer/src/services"
)

func main() {
	env, err := services.RetrieveENVVars()
	if err != nil {
		log.Fatalf("%s", err)
	}

	fmt.Printf("Server Port: %s\n", env.SERVER_PORT)
	fmt.Printf("Database Location: %s:%s@%s\n", env.DB_HOST, env.DB_PORT, env.DB_USER)

	err = db.ConnectToDB(env)
	if err != nil {
		log.Fatalf("Error ensuring database connection: %s", err)
	}
	fmt.Println("Connected to SQL database")
	defer db.CloseDatabase()

	err = db.EnsureDBTables()
	if err != nil {
		fmt.Printf("Error ensuring tables are created: %s\n", err)
	}

	services.AssignHandlers()

	srv := http.Server{
		Addr: "localhost:" + env.SERVER_PORT,
		// write must stay longer than read to have responses
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 3 * time.Second,
	}
	if err = srv.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start")
		return
	}
}
