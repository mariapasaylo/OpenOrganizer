import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

// test.db located in ..\AppData\Roaming\Electron
const dbPath = path.join(app.getPath('userData'), 'test.db');
const db = new Database(dbPath);

// Create example table
db.exec(`
  CREATE TABLE IF NOT EXISTS example (
    id VARCHAR(32),
    value VARCHAR(32)
  )
`);

// Load from example table
export function load(key: string) {
  const query = db.prepare('SELECT value FROM example WHERE id = ?');
  const row = query.get(key) as { value: string } | undefined;

  if (!row) return 'Not found';
  return row.value;
}

// Store in example table
export function store(key: string, value: string) {
  db.prepare('INSERT INTO example (id, value) VALUES (?, ?)').run(key, value);
}
