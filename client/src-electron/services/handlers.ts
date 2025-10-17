/*
 * Authors: Kevin Sirantoine
 * Created: 2025-09-25
 * Updated: 2025-10-17
 *
 * This file declares ipcMain handlers for APIs exposed in electron-preload and exports them via registerHandlers()
 * to electron-main.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import {ipcMain} from "electron";
import * as db from "../../src-electron/db/sqlite-db";
import {store} from "app/src-electron/services/store";
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
import {readNotesInRange} from "../../src-electron/db/sqlite-db";

export function registerHandlers()
{
  // SQLite Handlers
  // create
  ipcMain.handle('createNote', (event, newNote: Note) => {
    db.createNote(newNote);
  });

  ipcMain.handle('createReminder', (event, newRem: Reminder) => {
    db.createReminder(newRem);
  });

  ipcMain.handle('createDailyReminder', (event, newDailyRem: DailyReminder) => {
    db.createDailyReminder(newDailyRem);
  });

  ipcMain.handle('createWeeklyReminder', (event, newWeeklyRem: WeeklyReminder) => {
    db.createWeeklyReminder(newWeeklyRem);
  });

  ipcMain.handle('createMonthlyReminder', (event, newMonthlyRem: MonthlyReminder) => {
    db.createMonthlyReminder(newMonthlyRem);
  });

  ipcMain.handle('createYearlyReminder', (event, newYearlyRem: YearlyReminder) => {
    db.createYearlyReminder(newYearlyRem);
  });

  ipcMain.handle('createExtension', (event, newExt: Extension) => {
    db.createExtension(newExt);
  });

  ipcMain.handle('createFolder', (event, newFolder: Folder) => {
    db.createFolder(newFolder);
  });

  ipcMain.handle('createDeleted', (event, newDeleted: Deleted) => {
    db.createDeleted(newDeleted);
  });


  // read
  ipcMain.handle('readNote', (event, itemID: number) => {
    return db.readNote(itemID);
  });

  ipcMain.handle('readReminder', (event, itemID: number) => {
    return db.readReminder(itemID);
  });

  ipcMain.handle('readDailyReminder', (event, itemID: number) => {
    return db.readDailyReminder(itemID);
  });

  ipcMain.handle('readWeeklyReminder', (event, itemID: number) => {
    return db.readWeeklyReminder(itemID);
  });

  ipcMain.handle('readMonthlyReminder', (event, itemID: number) => {
    return db.readMonthlyReminder(itemID);
  });

  ipcMain.handle('readYearlyReminder', (event, itemID: number) => {
    return db.readYearlyReminder(itemID);
  });

  ipcMain.handle('readExtensions', (event, itemID: number) => {
    return db.readExtensions(itemID);
  });

  ipcMain.handle('readFolder', (event, folderID: number) => {
    return db.readFolder(folderID);
  });

  // read in range
  ipcMain.handle('readNotesInRange', (event, windowStartMs: number, windowEndMs: number) => {
    return db.readNotesInRange(windowStartMs, windowEndMs);
  });

  ipcMain.handle('readRemindersInRange', (event, rangeWindow: RangeWindow) => {
    return db.readRemindersInRange(rangeWindow);
  });

  ipcMain.handle('readDailyRemindersInRange', (event, rangeWindow: RangeWindow) => {
    return db.readDailyRemindersInRange(rangeWindow);
  });

  ipcMain.handle('readWeeklyRemindersInRange', (event, rangeWindow: RangeWindow) => {
    return db.readWeeklyRemindersInRange(rangeWindow);
  });

  ipcMain.handle('readMonthlyRemindersInRange', (event, rangeWindow: RangeWindow) => {
    return db.readMonthlyRemindersInRange(rangeWindow);
  });

  ipcMain.handle('readYearlyRemindersInRange', (event, rangeWindow: RangeWindow) => {
    return db.readYearlyRemindersInRange(rangeWindow);
  });

  // read all
  ipcMain.handle('readAllFolders', (event) => {
    return db.readAllFolders();
  });

  // read IDs based on folderID
  ipcMain.handle('readNotesInFolder', (event, folderID: number) => {
    return db.readNotesInFolder(folderID);
  });

  ipcMain.handle('readRemindersInFolder', (event, folderID: number) => {
    return db.readRemindersInFolder(folderID);
  });

  ipcMain.handle('readDailyRemindersInFolder', (event, folderID: number) => {
    return db.readDailyRemindersInFolder(folderID);
  });

  ipcMain.handle('readWeeklyRemindersInFolder', (event, folderID: number) => {
    return db.readWeeklyRemindersInFolder(folderID);
  });

  ipcMain.handle('readMonthlyRemindersInFolder', (event, folderID: number) => {
    return db.readMonthlyRemindersInFolder(folderID);
  });

  ipcMain.handle('readYearlyRemindersInFolder', (event, folderID: number) => {
    return db.readYearlyRemindersInFolder(folderID);
  });

  ipcMain.handle('readFoldersInFolder', (event, parentFolderID: number) => {
    return db.readFoldersInFolder(parentFolderID);
  });


  // update
  ipcMain.handle('updateNote', (event, modNote: Note) => {
    db.updateNote(modNote);
  });

  ipcMain.handle('updateReminder', (event, modRem: Reminder) => {
    db.updateReminder(modRem);
  });

  ipcMain.handle('updateDailyReminder', (event, modDailyRem: DailyReminder) => {
    db.updateDailyReminder(modDailyRem);
  });

  ipcMain.handle('updateWeeklyReminder', (event, modWeeklyRem: WeeklyReminder) => {
    db.updateWeeklyReminder(modWeeklyRem);
  });

  ipcMain.handle('updateMonthlyReminder', (event, modMonthlyRem: MonthlyReminder) => {
    db.updateMonthlyReminder(modMonthlyRem);
  });

  ipcMain.handle('updateYearlyReminder', (event, modYearlyRem: YearlyReminder) => {
    db.updateYearlyReminder(modYearlyRem);
  });

  ipcMain.handle('updateFolder', (event, modFolder: Folder) => {
    db.updateFolder(modFolder);
  });

  // delete
  ipcMain.handle('deleteNote', (event, itemID: number) => {
    return db.deleteNote(itemID);
  });

  ipcMain.handle('deleteReminder', (event, itemID: number) => {
    return db.deleteReminder(itemID);
  });

  ipcMain.handle('deleteDailyReminder', (event, itemID: number) => {
    return db.deleteDailyReminder(itemID);
  });

  ipcMain.handle('deleteWeeklyReminder', (event, itemID: number) => {
    return db.deleteWeeklyReminder(itemID);
  });

  ipcMain.handle('deleteMonthlyReminder', (event, itemID: number) => {
    return db.deleteMonthlyReminder(itemID);
  });

  ipcMain.handle('deleteYearlyReminder', (event, itemID: number) => {
    return db.deleteYearlyReminder(itemID);
  });

  ipcMain.handle('deleteExtension', (event, itemID: number, sequenceNum: number) => {
    db.deleteExtension(itemID, sequenceNum);
  });

  ipcMain.handle('deleteAllExtensions', (event, itemID: number) => {
    db.deleteAllExtensions(itemID);
  });

  ipcMain.handle('deleteFolder', (event, folderID: number) => {
    return db.deleteFolder(folderID);
  });


  // Example Handlers
  ipcMain.handle('sqliteRead', (event, key: string) => {
    return db.read(key);
  });

  ipcMain.handle('sqliteCreate', (event, key: string, value: string) => {
    db.create(key, value);
    return true;
  });

  ipcMain.handle('sqliteUpdate', (event, key: string, value: string) => {
    db.update(key, value);
    return true;
  });

  ipcMain.handle('sqliteDelete', (event, key: string) => {
    db.deleteEntry(key);
    return true;
  });

  // electron-store Handlers
  ipcMain.handle('getStoreName', () => {
    return store.get('name');
  });

  ipcMain.handle('setStoreName', (event, name: string) => {
    store.set('name', name);
    return true;
  });
}
