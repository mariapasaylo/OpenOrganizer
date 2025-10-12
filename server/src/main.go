/*
 * Authors: Michael Jagiello
 * Created: 2025-04-13
 * Updated: 2025-10-12
 *
 * This file is the entry point to the server.
 * It handles the large scope of the order of operations for initialization and serving requests.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package main

import (
	"fmt"
	"log"

	_ "github.com/lib/pq"

	"openorganizer/src/db"
	"openorganizer/src/services"
)

func main() {
	env, err := services.RetrieveENVVars()
	if err != nil {
		log.Fatalf("%s", err)
	}

	fmt.Printf("Database Location: %s:%s@%s\n", env.DB_HOST, env.DB_PORT, env.DB_USER)

	err = db.ConnectToDB(env)
	if err != nil {
		log.Fatalf("Error ensuring database connection: %s", err)
	}
	fmt.Println("Connected to SQL database")
	defer db.CloseDatabase()

	_ = db.EnsureDBTables(true)

	services.AssignHandlers()

	errs := services.Run(env)
	log.Fatal(<-errs)
}
