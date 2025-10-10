/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-09-20
 *
 * This file declares const values and defines functions for SQL statements to store and retrieve from the database.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package db

const createExampleTableSQL = `
	CREATE TABLE IF NOT EXISTS example (
		id VARCHAR(32),
		value VARCHAR(32)
	);`

func sqlCreate(k string, v string) string {
	return "INSERT INTO example (id, value) VALUES ('" + k + "','" + v + "');"
}

func sqlRead(k string) string {
	return "SELECT * FROM example WHERE id = '" + k + "'"
}

func sqlUpdate(k string, v string) string {
	return "UPDATE example SET value='" + v + "' WHERE id='" + k + "';"
}

func sqlDelete(k string) string {
	return "DELETE FROM example WHERE id='" + k + "';"
}
