/*
 * Authors: Kevin Sirantoine, Rachel Patella
 * Created: 2025-09-10
 * Updated: 2025-10-27
 *
 * This file initializes the SQLite database, prepares queries, and exports functions for interacting with the
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
  YearlyReminder,
  Deleted,
  RangeWindow
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
// create
const createNoteStmt = db.prepare(sql.createNoteStmt);
const createReminderStmt = db.prepare(sql.createReminderStmt);
const createDailyReminderStmt = db.prepare(sql.createDailyReminderStmt);
const createWeeklyReminderStmt = db.prepare(sql.createWeeklyReminderStmt);
const createMonthlyReminderStmt = db.prepare(sql.createMonthlyReminderStmt);
const createYearlyReminderStmt = db.prepare(sql.createYearlyReminderStmt);
const createExtensionStmt = db.prepare(sql.createExtensionStmt);
const createFolderStmt = db.prepare(sql.createFolderStmt);
const createDeletedStmt = db.prepare(sql.createDeletedStmt);

// read
const readNoteStmt = db.prepare(sql.readNoteStmt);
const readReminderStmt = db.prepare(sql.readReminderStmt);
const readDailyReminderStmt = db.prepare(sql.readDailyReminderStmt);
const readWeeklyReminderStmt = db.prepare(sql.readWeeklyReminderStmt);
const readMonthlyReminderStmt = db.prepare(sql.readMonthlyReminderStmt);
const readYearlyReminderStmt = db.prepare(sql.readYearlyReminderStmt);
const readExtensionsStmt = db.prepare(sql.readExtensionsStmt);
const readFolderStmt = db.prepare(sql.readFolderStmt);

const readNotesInRangeStmt = db.prepare(sql.readNotesInRangeStmt);
const readRemindersInRangeStmt = db.prepare(sql.readRemindersInRangeStmt);
const readDailyRemindersInRangeStmt = db.prepare(sql.readDailyRemindersInRangeStmt);
const readWeeklyRemindersInRangeStmt = db.prepare(sql.readWeeklyRemindersInRangeStmt);
const readMonthlyRemindersInRangeStmt = db.prepare(sql.readMonthlyRemindersInRangeStmt);
const readYearlyRemindersInRangeStmt = db.prepare(sql.readYearlyRemindersInRangeStmt);
const readAllFoldersStmt = db.prepare(sql.readAllFoldersStmt);

const readNotesInFolderStmt = db.prepare(sql.readNotesInFolderStmt);
const readRemindersInFolderStmt = db.prepare(sql.readRemindersInFolderStmt);
const readDailyRemindersInFolderStmt = db.prepare(sql.readDailyRemindersInFolderStmt);
const readWeeklyRemindersInFolderStmt = db.prepare(sql.readWeeklyRemindersInFolderStmt);
const readMonthlyRemindersInFolderStmt = db.prepare(sql.readMonthlyRemindersInFolderStmt);
const readYearlyRemindersInFolderStmt = db.prepare(sql.readYearlyRemindersInFolderStmt);
const readFoldersInFolderStmt = db.prepare(sql.readFoldersInFolderStmt);

// update
const updateNoteStmt = db.prepare(sql.updateNoteStmt);
const updateReminderStmt = db.prepare(sql.updateReminderStmt);
const updateDailyReminderStmt = db.prepare(sql.updateDailyReminderStmt);
const updateWeeklyReminderStmt = db.prepare(sql.updateWeeklyReminderStmt);
const updateMonthlyReminderStmt = db.prepare(sql.updateMonthlyReminderStmt);
const updateYearlyReminderStmt = db.prepare(sql.updateYearlyReminderStmt);
const updateFolderStmt = db.prepare(sql.updateFolderStmt);

//delete
const deleteNoteStmt = db.prepare(sql.deleteNoteStmt);
const deleteReminderStmt = db.prepare(sql.deleteReminderStmt);
const deleteDailyReminderStmt = db.prepare(sql.deleteDailyReminderStmt);
const deleteWeeklyReminderStmt = db.prepare(sql.deleteWeeklyReminderStmt);
const deleteMonthlyReminderStmt = db.prepare(sql.deleteMonthlyReminderStmt);
const deleteYearlyReminderStmt = db.prepare(sql.deleteYearlyReminderStmt);
const deleteExtensionStmt = db.prepare(sql.deleteExtensionStmt);
const deleteAllExtensionsStmt = db.prepare(sql.deleteAllExtensionsStmt);
const deleteFolderStmt = db.prepare(sql.deleteFolderStmt);


// Table CRUD functions:
// create
export function createNote(newNote: Note) {
  createNoteStmt.run(newNote.itemID, newNote.lastModified, newNote.folderID, newNote.isExtended, newNote.title, newNote.text);
}

export function createReminder(newRem: Reminder) {
  createReminderStmt.run(
    newRem.itemID, newRem.lastModified, newRem.folderID, newRem.eventType, newRem.eventStartYear, newRem.eventStartDay,
    newRem.eventStartMin, newRem.eventEndYear, newRem.eventEndDay, newRem.eventEndMin, newRem.notifYear,
    newRem.notifDay, newRem.notifMin, newRem.isExtended, newRem.hasNotif, newRem.title
  );
}

export function createDailyReminder(newDailyRem: DailyReminder) {
  createDailyReminderStmt.run(
    newDailyRem.itemID, newDailyRem.lastModified, newDailyRem.folderID, newDailyRem.eventType, newDailyRem.seriesStartYear,
    newDailyRem.seriesStartDay, newDailyRem.seriesStartMin, newDailyRem.seriesEndYear, newDailyRem.seriesEndDay,
    newDailyRem.seriesEndMin, newDailyRem.timeOfDayMin, newDailyRem.eventDurationMin, newDailyRem.notifOffsetTimeMin,
    newDailyRem.hasNotifs, newDailyRem.isExtended, newDailyRem.everyNDays, newDailyRem.title
  );
}

export function createWeeklyReminder(newWeeklyRem: WeeklyReminder) {
  createWeeklyReminderStmt.run(
    newWeeklyRem.itemID, newWeeklyRem.lastModified, newWeeklyRem.folderID, newWeeklyRem.eventType, newWeeklyRem.seriesStartYear,
    newWeeklyRem.seriesStartDay, newWeeklyRem.seriesStartMin, newWeeklyRem.seriesEndYear, newWeeklyRem.seriesEndDay,
    newWeeklyRem.seriesEndMin, newWeeklyRem.timeOfDayMin, newWeeklyRem.eventDurationMin, newWeeklyRem.notifOffsetTimeMin,
    newWeeklyRem.hasNotifs, newWeeklyRem.isExtended, newWeeklyRem.everyNWeeks, newWeeklyRem.daysOfWeek, newWeeklyRem.title
  );
}

export function createMonthlyReminder(newMonthlyRem: MonthlyReminder) {
  createMonthlyReminderStmt.run(
    newMonthlyRem.itemID, newMonthlyRem.lastModified, newMonthlyRem.folderID, newMonthlyRem.eventType, newMonthlyRem.seriesStartYear,
    newMonthlyRem.seriesStartDay, newMonthlyRem.seriesStartMin, newMonthlyRem.seriesEndYear, newMonthlyRem.seriesEndDay,
    newMonthlyRem.seriesEndMin, newMonthlyRem.timeOfDayMin, newMonthlyRem.eventDurationMin, newMonthlyRem.notifOffsetTimeMin,
    newMonthlyRem.hasNotifs, newMonthlyRem.isExtended, newMonthlyRem.lastDayOfMonth, newMonthlyRem.daysOfMonth, newMonthlyRem.title
  );
}

export function createYearlyReminder(newYearlyRem: YearlyReminder) {
  createYearlyReminderStmt.run(
    newYearlyRem.itemID, newYearlyRem.lastModified, newYearlyRem.folderID, newYearlyRem.eventType, newYearlyRem.seriesStartYear,
    newYearlyRem.seriesStartDay, newYearlyRem.seriesStartMin, newYearlyRem.seriesEndYear, newYearlyRem.seriesEndDay,
    newYearlyRem.seriesEndMin, newYearlyRem.timeOfDayMin, newYearlyRem.eventDurationMin, newYearlyRem.notifOffsetTimeMin,
    newYearlyRem.hasNotifs, newYearlyRem.isExtended, newYearlyRem.dayOfYear, newYearlyRem.title
  );
}

export function createExtension(newExt: Extension) {
  createExtensionStmt.run(newExt.itemID, newExt.sequenceNum, newExt.lastModified, newExt.data);
}

export function createFolder(newFolder: Folder) { // -1 treated as no colorCode
  createFolderStmt.run(newFolder.folderID, newFolder.lastModified, newFolder.parentFolderID, newFolder.colorCode, newFolder.folderName);
}

export function createDeleted(newDeleted: Deleted) {
  createDeletedStmt.run(newDeleted.itemID, newDeleted.lastModified, newDeleted.itemTable);
}


// read
export function readNote(itemID: bigint) {
  return readNoteStmt.get(itemID) as Note;
}

export function readReminder(itemID: bigint) {
  return readReminderStmt.get(itemID) as Reminder;
}

export function readDailyReminder(itemID: bigint) {
  return readDailyReminderStmt.get(itemID) as DailyReminder;
}

export function readWeeklyReminder(itemID: bigint) {
  return readWeeklyReminderStmt.get(itemID) as WeeklyReminder;
}

export function readMonthlyReminder(itemID: bigint) {
  return readMonthlyReminderStmt.get(itemID) as MonthlyReminder;
}

export function readYearlyReminder(itemID: bigint) {
  return readYearlyReminderStmt.get(itemID) as YearlyReminder;
}

export function readExtensions(itemID: bigint) {
  return readExtensionsStmt.all(itemID) as Extension[];
}

export function readFolder(folderID: bigint) {
  return readFolderStmt.get(folderID) as Folder;
}

// read in range
export function readNotesInRange(windowStartMs: bigint, windowEndMs: bigint) {
  return readNotesInRangeStmt.all({ windowStartMs: windowStartMs, windowEndMs: windowEndMs }) as Note[];
}

export function readRemindersInRange(rangeWindow: RangeWindow) {
  return readRemindersInRangeStmt.all({
    windowStartYear: rangeWindow.startYear,
    windowStartMinOfYear: rangeWindow.startMinOfYear,
    windowEndYear: rangeWindow.endYear,
    windowEndMinOfYear: rangeWindow.endMinOfYear
  }) as Reminder[];
}

export function readDailyRemindersInRange(rangeWindow: RangeWindow) {
  return readDailyRemindersInRangeStmt.all({
    windowStartYear: rangeWindow.startYear,
    windowStartMinOfYear: rangeWindow.startMinOfYear,
    windowEndYear: rangeWindow.endYear,
    windowEndMinOfYear: rangeWindow.endMinOfYear
  }) as DailyReminder[];
}

export function readWeeklyRemindersInRange(rangeWindow: RangeWindow) {
  return readWeeklyRemindersInRangeStmt.all({
    windowStartYear: rangeWindow.startYear,
    windowStartMinOfYear: rangeWindow.startMinOfYear,
    windowEndYear: rangeWindow.endYear,
    windowEndMinOfYear: rangeWindow.endMinOfYear
  }) as WeeklyReminder[];
}

export function readMonthlyRemindersInRange(rangeWindow: RangeWindow) {
  return readMonthlyRemindersInRangeStmt.all({
    windowStartYear: rangeWindow.startYear,
    windowStartMinOfYear: rangeWindow.startMinOfYear,
    windowEndYear: rangeWindow.endYear,
    windowEndMinOfYear: rangeWindow.endMinOfYear
  }) as MonthlyReminder[];
}

export function readYearlyRemindersInRange(rangeWindow: RangeWindow) {
  return readYearlyRemindersInRangeStmt.all({
    windowStartYear: rangeWindow.startYear,
    windowStartMinOfYear: rangeWindow.startMinOfYear,
    windowEndYear: rangeWindow.endYear,
    windowEndMinOfYear: rangeWindow.endMinOfYear
  }) as YearlyReminder[];
}

// read all
export function readAllFolders() {
  return readAllFoldersStmt.all() as Folder[];
}

// get IDs based on folderID
export function readNotesInFolder(folderID: bigint) {
  return readNotesInFolderStmt.all(folderID);
}

export function readRemindersInFolder(folderID: bigint) {
  return readRemindersInFolderStmt.all(folderID);
}

export function readDailyRemindersInFolder(folderID: bigint) {
  return readDailyRemindersInFolderStmt.all(folderID);
}

export function readWeeklyRemindersInFolder(folderID: bigint) {
  return readWeeklyRemindersInFolderStmt.all(folderID);
}

export function readMonthlyRemindersInFolder(folderID: bigint) {
  return readMonthlyRemindersInFolderStmt.all(folderID);
}

export function readYearlyRemindersInFolder(folderID: bigint) {
  return readYearlyRemindersInFolderStmt.all(folderID);
}

export function readFoldersInFolder(parentFolderID: bigint) {
  return readFoldersInFolderStmt.all(parentFolderID);
}


// update
export function updateNote(modNote: Note) {
  updateNoteStmt.run(
    modNote.lastModified, modNote.folderID, modNote.isExtended, modNote.title, modNote.text, modNote.itemID); // itemID last
}

export function updateReminder(modRem: Reminder) {
  updateReminderStmt.run(
    modRem.lastModified, modRem.folderID, modRem.eventType, modRem.eventStartYear, modRem.eventStartDay,
    modRem.eventStartMin, modRem.eventEndYear, modRem.eventEndDay, modRem.eventEndMin, modRem.notifYear,
    modRem.notifDay, modRem.notifMin, modRem.isExtended, modRem.hasNotif, modRem.title, modRem.itemID
  ); // itemID last
}

export function updateDailyReminder(modDailyRem: DailyReminder) {
  updateDailyReminderStmt.run(
    modDailyRem.lastModified, modDailyRem.folderID, modDailyRem.eventType, modDailyRem.seriesStartYear,
    modDailyRem.seriesStartDay, modDailyRem.seriesStartMin, modDailyRem.seriesEndYear, modDailyRem.seriesEndDay,
    modDailyRem.seriesEndMin, modDailyRem.timeOfDayMin, modDailyRem.eventDurationMin, modDailyRem.notifOffsetTimeMin,
    modDailyRem.hasNotifs, modDailyRem.isExtended, modDailyRem.everyNDays, modDailyRem.title, modDailyRem.itemID
  ); // itemID last
}

export function updateWeeklyReminder(modWeeklyRem: WeeklyReminder) {
  updateWeeklyReminderStmt.run(
    modWeeklyRem.lastModified, modWeeklyRem.folderID, modWeeklyRem.eventType, modWeeklyRem.seriesStartYear,
    modWeeklyRem.seriesStartDay, modWeeklyRem.seriesStartMin, modWeeklyRem.seriesEndYear, modWeeklyRem.seriesEndDay,
    modWeeklyRem.seriesEndMin, modWeeklyRem.timeOfDayMin, modWeeklyRem.eventDurationMin, modWeeklyRem.notifOffsetTimeMin,
    modWeeklyRem.hasNotifs, modWeeklyRem.isExtended, modWeeklyRem.everyNWeeks, modWeeklyRem.daysOfWeek, modWeeklyRem.title,
    modWeeklyRem.itemID
  ); // itemID last
}

export function updateMonthlyReminder(modMonthlyRem: MonthlyReminder) {
  updateMonthlyReminderStmt.run(
    modMonthlyRem.lastModified, modMonthlyRem.folderID, modMonthlyRem.eventType, modMonthlyRem.seriesStartYear,
    modMonthlyRem.seriesStartDay, modMonthlyRem.seriesStartMin, modMonthlyRem.seriesEndYear, modMonthlyRem.seriesEndDay,
    modMonthlyRem.seriesEndMin, modMonthlyRem.timeOfDayMin, modMonthlyRem.eventDurationMin, modMonthlyRem.notifOffsetTimeMin,
    modMonthlyRem.hasNotifs, modMonthlyRem.isExtended, modMonthlyRem.lastDayOfMonth, modMonthlyRem.daysOfMonth, modMonthlyRem.title,
    modMonthlyRem.itemID
  ); // itemID last
}

export function updateYearlyReminder(modYearlyRem: YearlyReminder) {
  updateYearlyReminderStmt.run(
    modYearlyRem.lastModified, modYearlyRem.folderID, modYearlyRem.eventType, modYearlyRem.seriesStartYear,
    modYearlyRem.seriesStartDay, modYearlyRem.seriesStartMin, modYearlyRem.seriesEndYear, modYearlyRem.seriesEndDay,
    modYearlyRem.seriesEndMin, modYearlyRem.timeOfDayMin, modYearlyRem.eventDurationMin, modYearlyRem.notifOffsetTimeMin,
    modYearlyRem.hasNotifs, modYearlyRem.isExtended, modYearlyRem.dayOfYear, modYearlyRem.title, modYearlyRem.itemID
  ); // itemID last
}

export function updateFolder(modFolder: Folder) {
  updateFolderStmt.run(modFolder.lastModified, modFolder.parentFolderID, modFolder.colorCode, modFolder.folderName, modFolder.folderID); // folderID last
}


// delete
export function deleteNote(itemID: bigint) {
  return (deleteNoteStmt.run(itemID).changes != 0);
}

export function deleteReminder(itemID: bigint) {
  return (deleteReminderStmt.run(itemID).changes != 0);
}

export function deleteDailyReminder(itemID: bigint) {
  return (deleteDailyReminderStmt.run(itemID).changes != 0);
}

export function deleteWeeklyReminder(itemID: bigint) {
  return (deleteWeeklyReminderStmt.run(itemID).changes != 0);
}

export function deleteMonthlyReminder(itemID: bigint) {
  return (deleteMonthlyReminderStmt.run(itemID).changes != 0);
}

export function deleteYearlyReminder(itemID: bigint) {
  return (deleteYearlyReminderStmt.run(itemID).changes != 0);
}

export function deleteExtension(itemID: bigint, sequenceNum: number) {
  deleteExtensionStmt.run(itemID, sequenceNum);
}

export function deleteAllExtensions(itemID: bigint) {
  deleteAllExtensionsStmt.run(itemID);
}

export function deleteFolder(folderID: bigint) {
  return (deleteFolderStmt.run(folderID).changes != 0);
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
