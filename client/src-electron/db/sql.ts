export const createExTable = `
  CREATE TABLE IF NOT EXISTS example (
    id VARCHAR(32),
    value VARCHAR(32)
  )`;

export const createExEntry = "INSERT INTO example (id, value) VALUES (?, ?)";
export const readExEntry = "SELECT value FROM example WHERE id = ?";
export const updateExEntry = "UPDATE example SET value = ? WHERE id = ?";
export const deleteExEntry = "DELETE FROM example WHERE id = ?";
