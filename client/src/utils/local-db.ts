/*
 * Authors: Kevin Sirantoine
 * Created: 2025-10-13
 * Updated: 2025-10-16
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
  getDayOfYear,
  isLeapYear
} from '@quasar/quasar-ui-qcalendar';
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

// create
export async function createNote(folderID: number, title: string, text: string) {
  const timeMs = Date.now();
  const extensions = Math.ceil(text.length/64) - 1;

  const newNote: Note = {
    itemID: timeMs,
    lastModified: timeMs,
    folderID: folderID,
    isExtended: (extensions === 0) ? 0 : 1, // If text is <= 64 chars, isExtended is false
    title: title,
    text: text.substring(0, 64)
  };
  await window.sqliteAPI.createNote(newNote);

  for (let i = 1; i <= extensions; i++) {
    const newExt: Extension = {
      itemID: timeMs,
      sequenceNum: i,
      lastModified: timeMs,
      data: text.substring(64*i, 64*(i+1))
    };
    await window.sqliteAPI.createExtension(newExt);
  }
}

export async function createReminder(
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
  };
  await window.sqliteAPI.createReminder(newRem);

  /* Todo: add specific extension implementation depending on eventType value
     const newExt: Extension = {
      itemID: timeMs,
      sequenceNum: 1,
      lastModified: timeMs,
      data: ???
    };
    await window.sqliteAPI.createExtension(newExt);
   */
}

export async function createDailyReminder(
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
  };
  await window.sqliteAPI.createDailyReminder(newDailyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function createWeeklyReminder(
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
  };
  await window.sqliteAPI.createWeeklyReminder(newWeeklyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function createMonthlyReminder(
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
  };
  await window.sqliteAPI.createMonthlyReminder(newMonthlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function createYearlyReminder(
  folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, recurTime: Timestamp, title: string) {
  const timeMs = Date.now();
  let dayOfYear = getDayOfYear(recurTime);
  if (isLeapYear(recurTime.year))
  {
    if (dayOfYear === 60) dayOfYear = 366; // set to 366 if dayOfYear is leap day
    else if (dayOfYear > 60) dayOfYear -= 1;
  }

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
  };
  await window.sqliteAPI.createYearlyReminder(newYearlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function createFolder(parentFolderID: number, colorCode: number, folderName: string) { // -1 treated as no colorCode
  const timeMs = Date.now();
  const newFolder: Folder = {
    folderID: timeMs,
    lastModified: timeMs,
    parentFolderID: parentFolderID,
    colorCode: colorCode,
    folderName: folderName
  };
  await window.sqliteAPI.createFolder(newFolder);
}

export async function createRootFolder(colorCode: number) { // -1 treated as no colorCode
  const timeMs = Date.now();
  const rootFolder: Folder = {
    folderID: 0,
    lastModified: timeMs,
    parentFolderID: -1,
    colorCode: colorCode,
    folderName: "root"
  };
  await window.sqliteAPI.createFolder(rootFolder);
}

export async function createDeleted(itemID: number, itemTable: number) {
  const timeMs = Date.now();
  const newDeleted: Deleted = {
    itemID: itemID,
    lastModified: timeMs,
    itemTable: itemTable,
  };
  await window.sqliteAPI.createDeleted(newDeleted);
}


// read
export async function readNote(itemID: number) {
  const note = await window.sqliteAPI.readNote(itemID);
  const extensions = await window.sqliteAPI.readExtensions(itemID);

  const fullText = [note.text];
  for (const extension of extensions) fullText.push(extension.data);
  note.text = fullText.join("");

  return note;
}

export async function readReminder(itemID: number) {
  return await window.sqliteAPI.readReminder(itemID);
}

export async function readDailyReminder(itemID: number) {
  return await window.sqliteAPI.readDailyReminder(itemID);
}

export async function readWeeklyReminder(itemID: number) {
  return await window.sqliteAPI.readWeeklyReminder(itemID);
}

export async function readMonthlyReminder(itemID: number) {
  return await window.sqliteAPI.readMonthlyReminder(itemID);
}

export async function readYearlyReminder(itemID: number) {
  return await window.sqliteAPI.readYearlyReminder(itemID);
}

export async function readFolder(folderID: number) {
  return await window.sqliteAPI.readFolder(folderID);
}

// todo: write individual functions to extract meaningful data from reminder extensions based on eventType using window.sqliteAPI.readExtensions()

// update
export async function updateNote(itemID: number, folderID: number, title: string, text: string) {
  const timeMs = Date.now();
  const extensions = Math.ceil(text.length/64) - 1;
  await window.sqliteAPI.deleteAllExtensions(itemID); // delete all extensions associated with note as they are recreated during an update

  const modNote: Note = {
    itemID: itemID,
    lastModified: timeMs,
    folderID: folderID,
    isExtended: (extensions === 0) ? 0 : 1, // If text is <= 64 chars, isExtended is false
    title: title,
    text: text.substring(0, 64)
  };
  await window.sqliteAPI.updateNote(modNote);

  for (let i = 1; i <= extensions; i++) {
    const newExt: Extension = {
      itemID: itemID,
      sequenceNum: i,
      lastModified: timeMs,
      data: text.substring(64*i, 64*(i+1))
    };
    await window.sqliteAPI.createExtension(newExt);
  }
}

export async function updateReminder(
  itemID: number, folderID: number, eventType: number, eventStartTime: Timestamp, eventEndTime: Timestamp,
  notifTime: Timestamp, hasNotif: boolean, title: string) {
  const timeMs = Date.now();

  const modRem: Reminder = {
    itemID: itemID,
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
  };
  await window.sqliteAPI.updateReminder(modRem);

  /* Todo: add specific extension implementation depending on eventType value
     const newExt: Extension = {
      itemID: timeMs,
      sequenceNum: 1,
      lastModified: timeMs,
      data: ???
    };
    await window.sqliteAPI.createExtension(newExt);
   */
}

export async function updateDailyReminder(
  itemID: number, folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, everyNDays: number, title: string) {
  const timeMs = Date.now();

  const modDailyRem: DailyReminder = {
    itemID: itemID,
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
  };
  await window.sqliteAPI.updateDailyReminder(modDailyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function updateWeeklyReminder(
  itemID: number, folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, everyNWeeks: number, daysOfWeek: string, title: string) {
  const timeMs = Date.now();

  const modWeeklyRem: WeeklyReminder = {
    itemID: itemID,
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
  };
  await window.sqliteAPI.updateWeeklyReminder(modWeeklyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function updateMonthlyReminder(
  itemID: number, folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, lastDayOfMonth: boolean, daysOfMonth: string, title: string) {
  const timeMs = Date.now();

  const modMonthlyRem: MonthlyReminder = {
    itemID: itemID,
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
  };
  await window.sqliteAPI.updateMonthlyReminder(modMonthlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function updateYearlyReminder(
  itemID: number, folderID: number, eventType: number, seriesStartTime: Timestamp, seriesEndTime: Timestamp, timeOfDayMin: number,
  eventDurationMin: number, notifOffsetTimeMin: number, hasNotifs: boolean, recurTime: Timestamp, title: string) {
  const timeMs = Date.now();
  let dayOfYear = getDayOfYear(recurTime);
  if (isLeapYear(recurTime.year))
  {
    if (dayOfYear === 60) dayOfYear = 366; // set to 366 if dayOfYear is leap day
    else if (dayOfYear > 60) dayOfYear -= 1;
  }

  const modYearlyRem: YearlyReminder = {
    itemID: itemID,
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
  };
  await window.sqliteAPI.updateYearlyReminder(modYearlyRem);

  // Todo: add specific extension implementation depending on eventType value
}

export async function updateFolder(folderID: number, parentFolderID: number, colorCode: number, folderName: string) { // -1 treated as no colorCode
  const timeMs = Date.now();
  const modFolder: Folder = {
    folderID: folderID,
    lastModified: timeMs,
    parentFolderID: parentFolderID,
    colorCode: colorCode,
    folderName: folderName
  };
  await window.sqliteAPI.updateFolder(modFolder);
}


// delete
// itemTable: 0 = notes, 1 = reminder, 2 = daily_reminder, 3 = weekly_reminder, 4 = monthly_reminder, 5 = yearly_reminder
export async function deleteItem(itemID: number, itemTable: number) { // used for all but specific extensions and folders
  let deleteOccurred = false;
  switch (itemTable) {
    case 0: {// note
      deleteOccurred = await window.sqliteAPI.deleteNote(itemID); // itemID MUST be present
      break;
    }
    case 1: { // reminder
      deleteOccurred = await window.sqliteAPI.deleteReminder(itemID);
      break;
    }
    case 2: { // daily_reminder
      deleteOccurred = await window.sqliteAPI.deleteDailyReminder(itemID);
      break;
    }
    case 3: { // weekly_reminder
      deleteOccurred = await window.sqliteAPI.deleteWeeklyReminder(itemID);
      break;
    }
    case 4: { // monthly_reminder
      deleteOccurred = await window.sqliteAPI.deleteMonthlyReminder(itemID);
      break;
    }
    case 5: { // yearly_reminder
      deleteOccurred = await window.sqliteAPI.deleteYearlyReminder(itemID);
      break;
    }
    default:
      break;
  }

  if (deleteOccurred) {
    await window.sqliteAPI.deleteAllExtensions(itemID); // delete all extensions associated with deleted item
    await createDeleted(itemID, itemTable); // create deleted entry for the deleted item
  }
}

export async function deleteExtension(itemID: number, sequenceNum: number) {
  await window.sqliteAPI.deleteExtension(itemID, sequenceNum); // delete an individual extension
}

// itemTable: 7 = folder
export async function deleteFolder(folderID: number) {
  if (folderID === 0) return // root folder cannot be deleted

  let items = await window.sqliteAPI.readNotesInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 0); // delete all items in the folder

  items = await window.sqliteAPI.readRemindersInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 1);

  items = await window.sqliteAPI.readDailyRemindersInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 2);

  items = await window.sqliteAPI.readWeeklyRemindersInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 3);

  items = await window.sqliteAPI.readMonthlyRemindersInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 4);

  items = await window.sqliteAPI.readYearlyRemindersInFolder(folderID);
  for (const item of items) await deleteItem(item.itemID, 5);

  const subFolders = await window.sqliteAPI.readFoldersInFolder(folderID);
  for (const subFolder of subFolders) await deleteFolder(subFolder.folderID); // recursively delete subfolders

  if (await window.sqliteAPI.deleteFolder(folderID)) await createDeleted(folderID, 7); // finally, delete the folder and create deleted entry
}
