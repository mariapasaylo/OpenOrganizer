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
