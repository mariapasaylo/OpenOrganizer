/*
 * Authors: Kevin Sirantoine
 * Created: 2025-09-25
 * Updated: 2025-10-15
 *
 * This file declares ipcMain handlers for APIs exposed in electron-preload and exports them via registerHandlers()
 * to electron-main.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import {ipcMain, Notification} from "electron";
import {create, deleteEntry, read, update} from "app/src-electron/db/sqlite-db";
import {store} from "app/src-electron/services/store";

export function registerHandlers()
{
  // SQLite Handlers
  ipcMain.handle('sqliteRead', (event, key: string) => {
    return read(key);
  });

  ipcMain.handle('sqliteCreate', (event, key: string, value: string) => {
    create(key, value);
    return true;
  });

  ipcMain.handle('sqliteUpdate', (event, key: string, value: string) => {
    update(key, value);
    return true;
  });

  ipcMain.handle('sqliteDelete', (event, key: string) => {
    deleteEntry(key);
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

  ipcMain.handle('showReminderNotification', (event, reminder: { title: string; date: string }) => {
    // Show the reminder notification
    new Notification({
      title: 'Reminder',
      body: `${reminder.title} is scheduled for ${reminder.date}`,
    }).show();
    return true;
  });
}
