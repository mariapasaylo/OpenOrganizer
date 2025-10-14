/*
 * Authors: Kevin Sirantoine
 * Created: 2025-10-13
 * Updated: 2025-10-14
 *
 * todo: write description
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import {
  type Timestamp,
  getDayOfYear
} from '@quasar/quasar-ui-qcalendar';
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

export function createNote(folderID: number, title: string, text: string) {
  const timeMs = Date.now();
  const extensions = Math.ceil(text.length/64) - 1;

  const newNote: Note = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    isExtended: (extensions === 0) ? 0 : 1, // If text is <= 64 chars, isExtended is false
    title: title,
    text: text.substring(0, 64)
  }
  window.sqliteAPI.createNote(newNote);

  for (let i = 1; i <= extensions; i++) {
    const newExt: Extension = {
      itemID: timeMs,
      sequenceNum: i,
      lastModified: timeMs,
      data: text.substring(64*i, 64*(i+1))
    }
    window.sqliteAPI.createExtension(newExt);
  }
}

export function createReminder(
  folderID: number, eventType: number, eventStartTime: Timestamp, eventEndTime: Timestamp,
  notifTime: Timestamp, hasNotif: boolean, title: string) {
  const timeMs = Date.now();

  const newRem: Reminder = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    eventType: eventType,
    eventStartYear: eventStartTime.year,
    eventStartDay: getDayOfYear(eventStartTime),
    eventStartMin: (eventStartTime.hour * 60) + eventStartTime.minute,
    eventEndYear: eventEndTime.year,
    eventEndDay: getDayOfYear(eventEndTime),
    eventEndMin: (eventEndTime.hour * 60) + eventEndTime.minute,
    notifYear: notifTime.year,
    notifDay: getDayOfYear(notifTime),
    notifMin: (notifTime.hour * 60) + notifTime.minute,
    isExtended: (eventType != 0) ? 1 : 0, // If reminder has eventType, isExtended is true
    hasNotif: (hasNotif) ? 1 : 0,
    title: title
  }
  window.sqliteAPI.createReminder(newRem);

  /* Todo: add specific extension implementation depending on eventType value
     const newExt: Extension = {
      itemID: timeMs,
      sequenceNum: 1,
      lastModified: timeMs,
      data: ???
    }
    window.sqliteAPI.createExtension(newExt);
   */
}

export function createDailyReminder(
  folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, everyNDays: number, title: string) {
  const timeMs = Date.now();

  const newDailyRem: DailyReminder = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    eventType: eventType,
    seriesStartYear: seriesStartTime.year,
    seriesStartDay: getDayOfYear(seriesStartTime),
    seriesStartMin: (seriesStartTime.hour * 60) + seriesStartTime.minute,
    seriesEndYear: seriesEndTime.year,
    seriesEndDay: getDayOfYear(seriesEndTime),
    seriesEndMin: (seriesEndTime.hour * 60) + seriesEndTime.minute,
    timeOfDayMin: timeOfDayMin,
    eventDurationMin: eventDurationMin,
    notifOffsetTimeMin: notifOffsetTimeMin,
    hasNotifs: (hasNotifs) ? 1 : 0,
    isExtended: (eventType != 0) ? 1 : 0, // If reminder has eventType, isExtended is true
    everyNDays: everyNDays,
    title: title
  }
  window.sqliteAPI.createDailyReminder(newDailyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export function createWeeklyReminder(
  folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, everyNWeeks: number, daysOfWeek: string, title: string) {
  const timeMs = Date.now();

  const newWeeklyRem: WeeklyReminder = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    eventType: eventType,
    seriesStartYear: seriesStartTime.year,
    seriesStartDay: getDayOfYear(seriesStartTime),
    seriesStartMin: (seriesStartTime.hour * 60) + seriesStartTime.minute,
    seriesEndYear: seriesEndTime.year,
    seriesEndDay: getDayOfYear(seriesEndTime),
    seriesEndMin: (seriesEndTime.hour * 60) + seriesEndTime.minute,
    timeOfDayMin: timeOfDayMin,
    eventDurationMin: eventDurationMin,
    notifOffsetTimeMin: notifOffsetTimeMin,
    hasNotifs: (hasNotifs) ? 1 : 0,
    isExtended: (eventType != 0) ? 1 : 0, // If reminder has eventType, isExtended is true
    everyNWeeks: everyNWeeks,
    daysOfWeek: daysOfWeek,
    title: title
  }
  window.sqliteAPI.createWeeklyReminder(newWeeklyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export function createMonthlyReminder(
  folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, lastDayOfMonth: boolean, daysOfMonth: string, title: string) {
  const timeMs = Date.now();

  const newMonthlyRem: MonthlyReminder = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    eventType: eventType,
    seriesStartYear: seriesStartTime.year,
    seriesStartDay: getDayOfYear(seriesStartTime),
    seriesStartMin: (seriesStartTime.hour * 60) + seriesStartTime.minute,
    seriesEndYear: seriesEndTime.year,
    seriesEndDay: getDayOfYear(seriesEndTime),
    seriesEndMin: (seriesEndTime.hour * 60) + seriesEndTime.minute,
    timeOfDayMin: timeOfDayMin,
    eventDurationMin: eventDurationMin,
    notifOffsetTimeMin: notifOffsetTimeMin,
    hasNotifs: (hasNotifs) ? 1 : 0,
    isExtended: (eventType != 0) ? 1 : 0, // If reminder has eventType, isExtended is true
    lastDayOfMonth: (lastDayOfMonth) ? 1 : 0,
    daysOfMonth: daysOfMonth,
    title: title
  }
  window.sqliteAPI.createMonthlyReminder(newMonthlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export function createYearlyReminder(
  folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, dayOfYear: number, title: string) {
  const timeMs = Date.now();

  const newYearlyRem: YearlyReminder = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    eventType: eventType,
    seriesStartYear: seriesStartTime.year,
    seriesStartDay: getDayOfYear(seriesStartTime),
    seriesStartMin: (seriesStartTime.hour * 60) + seriesStartTime.minute,
    seriesEndYear: seriesEndTime.year,
    seriesEndDay: getDayOfYear(seriesEndTime),
    seriesEndMin: (seriesEndTime.hour * 60) + seriesEndTime.minute,
    timeOfDayMin: timeOfDayMin,
    eventDurationMin: eventDurationMin,
    notifOffsetTimeMin: notifOffsetTimeMin,
    hasNotifs: (hasNotifs) ? 1 : 0,
    isExtended: (eventType != 0) ? 1 : 0, // If reminder has eventType, isExtended is true
    dayOfYear: dayOfYear,
    title: title
  }
  window.sqliteAPI.createYearlyReminder(newYearlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export function createFolder(parentFolderID: number, colorCode: number, folderName: string) { // -1 treated as no colorCode
  const timeMs = Date.now();
  const newFolder: Folder = {
    folderID: timeMs,
    lastModified: timeMs,
    parentFolderID: parentFolderID,
    colorCode: colorCode,
    folderName: folderName
  }
  window.sqliteAPI.createFolder(newFolder);
}

export function createRootFolder(colorCode: number) { // -1 treated as no colorCode
  const timeMs = Date.now();
  const rootFolder: Folder = {
    folderID: 0,
    lastModified: timeMs,
    parentFolderID: -1,
    colorCode: colorCode,
    folderName: "root"
  }
  window.sqliteAPI.createFolder(rootFolder);
}
