/*
 * Authors: Kevin Sirantoine
 * Created: 2025-09-25
 * Updated: 2025-09-25
 *
 * This file contains and exports all SQL statements used by sqlite-db.
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
export const createExTable = `
  CREATE TABLE IF NOT EXISTS example (
    id VARCHAR(32),
    value VARCHAR(32)
  )`;

export const createExEntry = "INSERT INTO example (id, value) VALUES (?, ?)";
export const readExEntry = "SELECT value FROM example WHERE id = ?";
export const updateExEntry = "UPDATE example SET value = ? WHERE id = ?";
export const deleteExEntry = "DELETE FROM example WHERE id = ?";
