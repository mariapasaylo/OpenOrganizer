/*
 * Authors: Kevin Sirantoine, Rachel Patella, Maria Pasaylo
 * Created: 2025-09-10
 * Updated: 2025-10-16
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
  Deleted
} from "app/src-electron/types/shared-types";

export {};

declare global {
  interface Window {
    sqliteAPI: {
      // create
      createNote: (newNote: Note) => void;
      createReminder: (newRem: Reminder) => void;
      createDailyReminder: (newDailyRem: DailyReminder) => void;
      createWeeklyReminder: (newWeeklyRem: WeeklyReminder) => void;
      createMonthlyReminder: (newMonthlyRem: MonthlyReminder) => void;
      createYearlyReminder: (newYearlyRem: YearlyReminder) => void;
      createExtension: (newExt: Extension) => void;
      createFolder: (newFolder: Folder) => void;
      createDeleted: (newDeleted: Deleted) => void;

      // read
      readNote: (itemID: number) => Note;
      readReminder: (itemID: number) => Reminder;
      readDailyReminder: (itemID: number) => DailyReminder;
      readWeeklyReminder: (itemID: number) => WeeklyReminder;
      readMonthlyReminder: (itemID: number) => MonthlyReminder;
      readYearlyReminder: (itemID: number) => YearlyReminder;
      readExtensions: (itemID: number) => Extension[];
      readFolder: (folderID: number) => Folder;

      readNotesInFolder: (folderID: number) => { itemID: number }[];
      readRemindersInFolder: (folderID: number) => { itemID: number }[];
      readDailyRemindersInFolder: (folderID: number) => { itemID: number }[];
      readWeeklyRemindersInFolder: (folderID: number) => { itemID: number }[];
      readMonthlyRemindersInFolder: (folderID: number) => { itemID: number }[];
      readYearlyRemindersInFolder: (folderID: number) => { itemID: number }[];
      readFoldersInFolder: (parentFolderID: number) => { folderID: number }[];

      // update
      updateNote: (modNote: Note) => void;
      updateReminder: (modRem: Reminder) => void;
      updateDailyReminder: (modDailyRem: DailyReminder) => void;
      updateWeeklyReminder: (modWeeklyRem: WeeklyReminder) => void;
      updateMonthlyReminder: (modMonthlyRem: MonthlyReminder) => void;
      updateYearlyReminder: (modYearlyRem: YearlyReminder) => void;
      updateFolder: (modFolder: Folder) => void;

      // delete
      deleteNote: (itemID: number) => boolean;
      deleteReminder: (itemID: number) => boolean;
      deleteDailyReminder: (itemID: number) => boolean;
      deleteWeeklyReminder: (itemID: number) => boolean;
      deleteMonthlyReminder: (itemID: number) => boolean;
      deleteYearlyReminder: (itemID: number) => boolean;
      deleteExtension: (itemID: number, sequenceNum: number) => void;
      deleteAllExtensions: (itemID: number) => void;
      deleteFolder: (folderID: number) => boolean;

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
  }
}
