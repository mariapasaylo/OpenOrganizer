/*
 * Authors: Kevin Sirantoine, Rachel Patella
 * Created: 2025-09-10
 * Updated: 2025-10-14
 *
 * This file Initializes the SQLite database, prepares queries, and exports functions for interacting with the
 * SQLite database.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import * as sql from "./sql";
import type {
  Note,
  Extension,
  Folder,
  Reminder,
  DailyReminder,
  WeeklyReminder,
  MonthlyReminder,
  YearlyReminder
} from "app/src-electron/types/shared-types";

// local.db located in ..\AppData\Roaming\Electron
const dbPath = path.join(app.getPath('userData'), 'local.db');
const db = new Database(dbPath);

// Create tables if not exists
db.exec(sql.createNotesTable);
db.exec(sql.createRemindersTable);
db.exec(sql.createDailyTable);
db.exec(sql.createWeeklyTable);
db.exec(sql.createMonthlyTable);
db.exec(sql.createYearlyTable);
db.exec(sql.createGeneratedTable);
db.exec(sql.createExtensionsTable);
db.exec(sql.createOverridesTable);
db.exec(sql.createFoldersTable);
db.exec(sql.createDeletedTable);

// prepare all sql queries once
const createNoteStmt = db.prepare(sql.createNoteStmt);
const createReminderStmt = db.prepare(sql.createReminderStmt);
const createDailyReminderStmt = db.prepare(sql.createDailyReminderStmt);
const createWeeklyReminderStmt = db.prepare(sql.createWeeklyReminderStmt);
const createMonthlyReminderStmt = db.prepare(sql.createMonthlyReminderStmt);
const createYearlyReminderStmt = db.prepare(sql.createYearlyReminderStmt);
const createExtensionStmt = db.prepare(sql.createExtensionStmt);
const createFolderStmt = db.prepare(sql.createFolderStmt);


// Table CRUD functions:
// Create entry in example table
export function createNote(newNote: Note) {
  createNoteStmt.run(newNote.itemID, newNote.lastModified, newNote.folderID, newNote.isExtended, newNote.title, newNote.text);
}

export function createReminder(newRem: Reminder) {
  createReminderStmt.run(
    newRem.itemID, newRem.lastModified, newRem.folderID, newRem.eventType, newRem.eventStartYear, newRem.eventStartDay,
    newRem.eventStartMin, newRem.eventEndYear, newRem.eventEndDay, newRem.eventEndMin, newRem.notifYear,
    newRem.notifDay, newRem.notifMin, newRem.isExtended, newRem.hasNotif, newRem.title);
}

export function createDailyReminder(newDailyRem: DailyReminder) {
  createDailyReminderStmt.run(
    newDailyRem.itemID, newDailyRem.lastModified, newDailyRem.folderID, newDailyRem.eventType, newDailyRem.seriesStartYear,
    newDailyRem.seriesStartDay, newDailyRem.seriesStartMin, newDailyRem.seriesEndYear, newDailyRem.seriesEndDay,
    newDailyRem.seriesEndMin, newDailyRem.timeOfDayMin, newDailyRem.eventDurationMin, newDailyRem.notifOffsetTimeMin, newDailyRem.hasNotifs,
    newDailyRem.isExtended, newDailyRem.everyNDays, newDailyRem.title);
}

export function createWeeklyReminder(newWeeklyRem: WeeklyReminder) {
  createWeeklyReminderStmt.run(
    newWeeklyRem.itemID, newWeeklyRem.lastModified, newWeeklyRem.folderID, newWeeklyRem.eventType, newWeeklyRem.seriesStartYear,
    newWeeklyRem.seriesStartDay, newWeeklyRem.seriesStartMin, newWeeklyRem.seriesEndYear, newWeeklyRem.seriesEndDay,
    newWeeklyRem.seriesEndMin, newWeeklyRem.timeOfDayMin, newWeeklyRem.eventDurationMin, newWeeklyRem.notifOffsetTimeMin, newWeeklyRem.hasNotifs,
    newWeeklyRem.isExtended, newWeeklyRem.everyNWeeks, newWeeklyRem.daysOfWeek, newWeeklyRem.title);
}

export function createMonthlyReminder(newMonthlyRem: MonthlyReminder) {
  createMonthlyReminderStmt.run(
    newMonthlyRem.itemID, newMonthlyRem.lastModified, newMonthlyRem.folderID, newMonthlyRem.eventType, newMonthlyRem.seriesStartYear,
    newMonthlyRem.seriesStartDay, newMonthlyRem.seriesStartMin, newMonthlyRem.seriesEndYear, newMonthlyRem.seriesEndDay,
    newMonthlyRem.seriesEndMin, newMonthlyRem.timeOfDayMin, newMonthlyRem.eventDurationMin, newMonthlyRem.notifOffsetTimeMin, newMonthlyRem.hasNotifs,
    newMonthlyRem.isExtended, newMonthlyRem.lastDayOfMonth, newMonthlyRem.daysOfMonth, newMonthlyRem.title);
}

export function createYearlyReminder(newYearlyRem: YearlyReminder) {
  createYearlyReminderStmt.run(
    newYearlyRem.itemID, newYearlyRem.lastModified, newYearlyRem.folderID, newYearlyRem.eventType, newYearlyRem.seriesStartYear,
    newYearlyRem.seriesStartDay, newYearlyRem.seriesStartMin, newYearlyRem.seriesEndYear, newYearlyRem.seriesEndDay,
    newYearlyRem.seriesEndMin, newYearlyRem.timeOfDayMin, newYearlyRem.eventDurationMin, newYearlyRem.notifOffsetTimeMin, newYearlyRem.hasNotifs,
    newYearlyRem.isExtended, newYearlyRem.dayOfYear, newYearlyRem.title);
}

export function createExtension(newExt: Extension) {
  createExtensionStmt.run(newExt.itemID, newExt.sequenceNum, newExt.lastModified, newExt.data);
}

export function createFolder(newFolder: Folder) { // -1 treated as no colorCode
  createFolderStmt.run(newFolder.folderID, newFolder.lastModified, newFolder.parentFolderID, newFolder.colorCode, newFolder.folderName);
}


// Example db
// test.db located in ..\AppData\Roaming\Electron
const exDBPath = path.join(app.getPath('userData'), 'test.db');
const exDB = new Database(exDBPath);

// Create example table if not exists
exDB.exec(sql.createExTable);

// prepare all sql queries once
const createExEntry = exDB.prepare(sql.createExEntry);
const readExEntry = exDB.prepare(sql.readExEntry);
const updateExEntry = exDB.prepare(sql.updateExEntry);
const deleteExEntry = exDB.prepare(sql.deleteExEntry);

// Create entry in example table
export function create(key: string, value: string) {
  createExEntry.run(key, value);
}

// Read entry from example table
export function read(key: string) {
  const row = readExEntry.get(key) as { value: string } | undefined;

  if (!row) return 'Not found';
  return row.value;
}

// Update entry in example table
export function update(key: string, value: string) {
  updateExEntry.run(value, key);
}

// Delete entry from example table
export function deleteEntry(key: string) {
  deleteExEntry.run(key);
}
