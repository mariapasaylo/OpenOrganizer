/*
 * Authors: Kevin Sirantoine, Rachel Patella, Maria Pasaylo
 * Created: 2025-09-10
 * Updated: 2025-10-20
 *
 * This file declares sqliteAPI and electronStoreAPI for the renderer.
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
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

export {};

declare global {
  interface Window {
    sqliteAPI: {
      // create
      createNote: (newNote: Note) => Promise<void>;
      createReminder: (newRem: Reminder) => Promise<void>;
      createDailyReminder: (newDailyRem: DailyReminder) => Promise<void>;
      createWeeklyReminder: (newWeeklyRem: WeeklyReminder) => Promise<void>;
      createMonthlyReminder: (newMonthlyRem: MonthlyReminder) => Promise<void>;
      createYearlyReminder: (newYearlyRem: YearlyReminder) => Promise<void>;
      createExtension: (newExt: Extension) => Promise<void>;
      createFolder: (newFolder: Folder) => Promise<void>;
      createDeleted: (newDeleted: Deleted) => Promise<void>;

      // read
      readNote: (itemID: number) => Promise<Note>;
      readReminder: (itemID: number) => Promise<Reminder>;
      readDailyReminder: (itemID: number) => Promise<DailyReminder>;
      readWeeklyReminder: (itemID: number) => Promise<WeeklyReminder>;
      readMonthlyReminder: (itemID: number) => Promise<MonthlyReminder>;
      readYearlyReminder: (itemID: number) => Promise<YearlyReminder>;
      readExtensions: (itemID: number) => Promise<Extension[]>;
      readFolder: (folderID: number) => Promise<Folder>;

      readNotesInRange: (windowStartMs: number, windowEndMs: number) => Promise<Note[]>;
      readRemindersInRange: (rangeWindow: RangeWindow) => Promise<Reminder[]>;
      readDailyRemindersInRange: (rangeWindow: RangeWindow) => Promise<DailyReminder[]>;
      readWeeklyRemindersInRange: (rangeWindow: RangeWindow) => Promise<WeeklyReminder[]>;
      readMonthlyRemindersInRange: (rangeWindow: RangeWindow) => Promise<MonthlyReminder[]>;
      readYearlyRemindersInRange: (rangeWindow: RangeWindow) => Promise<YearlyReminder[]>;

      readAllFolders: () => Promise<Folder[]>;

      readNotesInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readRemindersInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readDailyRemindersInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readWeeklyRemindersInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readMonthlyRemindersInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readYearlyRemindersInFolder: (folderID: number) => Promise<{ itemID: number }[]>;
      readFoldersInFolder: (parentFolderID: number) => Promise<{ folderID: number }[]>;

      // update
      updateNote: (modNote: Note) => Promise<void>;
      updateReminder: (modRem: Reminder) => Promise<void>;
      updateDailyReminder: (modDailyRem: DailyReminder) => Promise<void>;
      updateWeeklyReminder: (modWeeklyRem: WeeklyReminder) => Promise<void>;
      updateMonthlyReminder: (modMonthlyRem: MonthlyReminder) => Promise<void>;
      updateYearlyReminder: (modYearlyRem: YearlyReminder) => Promise<void>;
      updateFolder: (modFolder: Folder) => Promise<void>;

      // delete
      deleteNote: (itemID: number) => Promise<boolean>;
      deleteReminder: (itemID: number) => Promise<boolean>;
      deleteDailyReminder: (itemID: number) => Promise<boolean>;
      deleteWeeklyReminder: (itemID: number) => Promise<boolean>;
      deleteMonthlyReminder: (itemID: number) => Promise<boolean>;
      deleteYearlyReminder: (itemID: number) => Promise<boolean>;
      deleteExtension: (itemID: number, sequenceNum: number) => Promise<void>;
      deleteAllExtensions: (itemID: number) => Promise<void>;
      deleteFolder: (folderID: number) => Promise<boolean>;

      // Example functions
      sqliteRead: (key: string) => Promise<string>;
      sqliteCreate: (key: string, value: string) => Promise<boolean>;
      sqliteUpdate: (key: string, value: string) => Promise<boolean>;
      sqliteDelete: (key: string) => Promise<boolean>;
    };

    electronStoreAPI: {
      getStoreName: () => Promise<string>;
      setStoreName: (name: string) => Promise<boolean>;
    };

    electronAuthAPI: {
      createAccount: (username: string, password: string) => Promise<{ success: boolean; message: string}>;
    }

    reminderNotificationAPI: {
      showReminderNotification: (reminder: { title: string; date: string }) => Promise<boolean>;
      scheduleReminderNotification: (reminder: { itemID: string; date: string; title: string; time?: string; unixMilliseconds?: number }) => Promise<boolean>;
    };
  }
}
