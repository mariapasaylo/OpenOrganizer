/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-10-11
 *
 * This file declares const values and defines functions for SQL statements to store and retrieve from the database.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package db

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
	username CHAR(32),
	userID BIGINT,
	lastUpdated BIGINT,
	lastLogin BIGINT,
	passwordHashHash BYTEA,
	salt INT,
	encrPrivateKey BYTEA,
	encrPrivateKey2 BYTEA
);`

const createTableTokens = `
CREATE TABLE IF NOT EXISTS tokens (
	userID BIGINT,
	creationTime BIGINT,
	expirationTime BIGINT,
	authToken BYTEA
);`

const createTableLastUpdated = `
CREATE TABLE IF NOT EXISTS last_updated (
	userID BIGINT,
	lastUpNotes BIGINT,
	lastUpReminders BIGINT,
	lastUpDaily BIGINT,
	lastUpWeekly BIGINT,
	lastUpMonthly BIGINT,
	lastUpYearly BIGINT,
	lastUpExtensions BIGINT,
	lastUpOverrides BIGINT,
	lastUpFolders BIGINT,
	lastUpDeleted BIGINT
);`

const createTableNotes = `
CREATE TABLE IF NOT EXISTS notes (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableReminders = `
CREATE TABLE IF NOT EXISTS reminders (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableDaily = `
CREATE TABLE IF NOT EXISTS daily_reminders (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableWeekly = `
CREATE TABLE IF NOT EXISTS weekly_reminders (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableMonthly = `
CREATE TABLE IF NOT EXISTS monthly_reminders (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableYearly = `
CREATE TABLE IF NOT EXISTS yearly_reminders (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableExtensions = `
CREATE TABLE IF NOT EXISTS extensions (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	sequenceNum INT,
	encryptedData BYTEA
);`

const createTableOverrides = `
CREATE TABLE IF NOT EXISTS overrides (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	linkedItemID BIGINT,
	encryptedData BYTEA
);`

const createTableFolders = `
CREATE TABLE IF NOT EXISTS folders (
	userID BIGINT,
	folderID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	encryptedData BYTEA
);`

const createTableDeleted = `
CREATE TABLE IF NOT EXISTS deleted (
	userID BIGINT,
	itemID BIGINT,
	lastModified BIGINT,
	lastUpdated BIGINT,
	itemTable SMALLINT
);`

const dropAllTables = `
DROP TABLE users;
DROP TABLE tokens;
DROP TABLE last_updated;
DROP TABLE notes;
DROP TABLE reminders;
DROP TABLE daily_reminders;
DROP TABLE weekly_reminders;
DROP TABLE monthly_reminders;
DROP TABLE yearly_reminders;
DROP TABLE extensions;
DROP TABLE overrides;
DROP TABLE folders;
DROP TABLE deleted;
`
