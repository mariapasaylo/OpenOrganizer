/*
 * Authors: Kevin Sirantoine
 * Created: 2025-10-13
 * Updated: 2025-10-27
 *
 * This file contains interfaces that are shared between the main and renderer processes to easily pass database entries
 * and other values.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

// table interfaces
export interface Note {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  isExtended: number;
  title: string;
  text: string;
}

export interface Extension {
  itemID: bigint;
  sequenceNum: number;
  lastModified: bigint;
  data: string;
}

export interface Folder {
  folderID: bigint;
  lastModified: bigint;
  parentFolderID: bigint;
  colorCode: number;
  folderName: string;
}

export interface Reminder {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  eventType: number;
  eventStartYear: number;
  eventStartDay: number;
  eventStartMin: number;
  eventEndYear: number;
  eventEndDay: number;
  eventEndMin: number;
  notifYear: number;
  notifDay: number;
  notifMin: number;
  isExtended: number;
  hasNotif: number;
  title: string;
}

export interface DailyReminder {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  eventType: number;
  seriesStartYear: number;
  seriesStartDay: number;
  seriesStartMin: number;
  seriesEndYear: number;
  seriesEndDay: number;
  seriesEndMin: number;
  timeOfDayMin: number;
  eventDurationMin: number;
  notifOffsetTimeMin: number;
  hasNotifs: number;
  isExtended: number;
  everyNDays: number;
  title: string;
}

export interface WeeklyReminder {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  eventType: number;
  seriesStartYear: number;
  seriesStartDay: number;
  seriesStartMin: number;
  seriesEndYear: number;
  seriesEndDay: number;
  seriesEndMin: number;
  timeOfDayMin: number;
  eventDurationMin: number;
  notifOffsetTimeMin: number;
  hasNotifs: number;
  isExtended: number;
  everyNWeeks: number;
  daysOfWeek: string;
  title: string;
}

export interface MonthlyReminder {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  eventType: number;
  seriesStartYear: number;
  seriesStartDay: number;
  seriesStartMin: number;
  seriesEndYear: number;
  seriesEndDay: number;
  seriesEndMin: number;
  timeOfDayMin: number;
  eventDurationMin: number;
  notifOffsetTimeMin: number;
  hasNotifs: number;
  isExtended: number;
  lastDayOfMonth: number;
  daysOfMonth: string;
  title: string;
}

export interface YearlyReminder {
  itemID: bigint;
  lastModified: bigint;
  folderID: bigint;
  eventType: number;
  seriesStartYear: number;
  seriesStartDay: number;
  seriesStartMin: number;
  seriesEndYear: number;
  seriesEndDay: number;
  seriesEndMin: number;
  timeOfDayMin: number;
  eventDurationMin: number;
  notifOffsetTimeMin: number;
  hasNotifs: number;
  isExtended: number;
  dayOfYear: number;
  title: string;
}

export interface Deleted {
  itemID: bigint;
  lastModified: bigint;
  itemTable: number;
}

// other interfaces
export interface RangeWindow {
  startYear: number;
  startMinOfYear: number;
  endYear: number;
  endMinOfYear: number;
}
