/*
 * Authors: Kevin Sirantoine
 * Created: 2025-10-13
 * Updated: 2025-10-15
 *
 * todo: write description
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
export interface Note {
  itemID: number;
  lastModified: number;
  folderID: number;
  isExtended: number;
  title: string;
  text: string;
}

export interface Extension {
  itemID: number;
  sequenceNum: number;
  lastModified: number;
  data: string;
}

export interface Folder {
  folderID: number;
  lastModified: number;
  parentFolderID: number;
  colorCode: number;
  folderName: string;
}

export interface Reminder {
  itemID: number;
  lastModified: number;
  folderID: number;
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
  itemID: number;
  lastModified: number;
  folderID: number;
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
  itemID: number;
  lastModified: number;
  folderID: number;
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
  itemID: number;
  lastModified: number;
  folderID: number;
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
  itemID: number;
  lastModified: number;
  folderID: number;
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
  itemID: number;
  lastModified: number;
  itemTable: number;
}
