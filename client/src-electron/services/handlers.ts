/*
 * Authors: Kevin Sirantoine, Rachel Patella
 * Created: 2025-09-25
 * Updated: 2025-10-16
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
// import schedule from 'node-schedule';

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

  // Schedule a reminder notification once at local timezone and specific date and time
  ipcMain.handle('scheduleReminderNotification', (event, reminder: { itemID: string; date: string; title: string; time?: string; unixMilliseconds?: number}) => {
      const unixMillisecondsTime = Number(reminder.unixMilliseconds);
      // Derive datetime from unix epoch milliseconds timestamp
      // const dateTime = new Date(unixMillisecondsTime);
      
      // Time until the notification should go off. Computes how many milliseconds there are from now until the reminder epoch time
      // Current time since epoch in ms - time since epoch for reminder in ms
      const delay = unixMillisecondsTime - Date.now();
      console.log('Delay between now and reminder time:', delay);

      // Do not schedule reminder notification in the past
      if (delay <= 0) {
        console.error('Reminder time is in the past. Cannot schedule notification.');
        return false;
      }

      // Workaround with setTimeout
      // Schedule the reminder notification after the delay time
      setTimeout(() => {
          new Notification({
          title: 'Reminder',
          body: `${reminder.title} is scheduled for ${reminder.time} on ${reminder.date}`,
        }).show();
      }, delay);

      // Issue with node-schedule and scheduleJob not working in packaged app - needs further investigation
      /*
      schedule.scheduleJob(dateTime, () => {
        new Notification({
          title: 'Reminder',
          body: `${reminder.title} is scheduled for ${reminder.time} on ${reminder.date}`,
        }).show();
      });
      */

    return true;
  });
}
