/*
 * Authors: Kevin Sirantoine, Michael Jagiello
 * Created: 2025-10-29
 * Updated: 2025-11-05
 *
 * This file defines functions for converting byte arrays into interface arrays for use in parsing syncdown.ts responses.
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
  Flight,
  Hotel
} from "app/src-electron/types/shared-types";
import {decrypt} from "app/src-electron/services/crypto";
import {getPrivateKey1} from "app/src-electron/services/auth";

export function unpackLastUp(data: Buffer) {
  return {
    lastUpNotes: data.readBigInt64LE(0),
    lastUpReminders: data.readBigInt64LE(8),
    lastUpDaily: data.readBigInt64LE(16),
    lastUpWeekly: data.readBigInt64LE(24),
    lastUpMonthly: data.readBigInt64LE(32),
    lastUpYearly: data.readBigInt64LE(40),
    lastUpExtensions: data.readBigInt64LE(48),
    lastUpOverrides: data.readBigInt64LE(56),
    lastUpFolders: data.readBigInt64LE(64),
    lastUpDeleted: data.readBigInt64LE(72),
  } as ServerLastUp;
}

export function unpackNotes(repeatedData: Buffer, recordCount: number) {
  const notes: Note[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 128);
    bufPos += 144;

    let decrBufPos = 0;
    notes[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      isExtended: item.decrData[decrBufPos += 8]!, // increment decrBufPos before using it
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 1, decrBufPos + 48), 48),
      text: getStringFromBuf(item.decrData.subarray(decrBufPos += 48, decrBufPos + 64), 64)
    };
  }
  return notes;
}

export function unpackReminders(repeatedData: Buffer, recordCount: number) {
  const reminders: Reminder[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 96);
    bufPos += 112;

    let decrBufPos = 0;
    reminders[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      eventType: item.decrData.readInt32LE(decrBufPos += 8),
      eventStartYear: item.decrData.readInt32LE(decrBufPos += 4),
      eventStartDay: item.decrData.readInt16LE(decrBufPos += 4),
      eventStartMin: item.decrData.readInt16LE(decrBufPos += 2),
      eventEndYear: item.decrData.readInt32LE(decrBufPos += 2),
      eventEndDay: item.decrData.readInt16LE(decrBufPos += 4),
      eventEndMin: item.decrData.readInt16LE(decrBufPos += 2),
      notifYear: item.decrData.readInt32LE(decrBufPos += 2),
      notifDay: item.decrData.readInt16LE(decrBufPos += 4),
      notifMin: item.decrData.readInt16LE(decrBufPos += 2),
      isExtended: item.decrData[decrBufPos += 2]!,
      hasNotif: item.decrData[decrBufPos += 1]!,
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 1, decrBufPos + 48), 48)
    };
  }
  return reminders;
}

export function unpackDailyReminders(repeatedData: Buffer, recordCount: number) {
  const dailyReminders: DailyReminder[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 96);
    bufPos += 112;

    let decrBufPos = 0;
    dailyReminders[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      eventType: item.decrData.readInt32LE(decrBufPos += 8),
      seriesStartYear: item.decrData.readInt32LE(decrBufPos += 4),
      seriesStartDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesStartMin: item.decrData.readInt16LE(decrBufPos += 2),
      seriesEndYear: item.decrData.readInt32LE(decrBufPos += 2),
      seriesEndDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesEndMin: item.decrData.readInt16LE(decrBufPos += 2),
      timeOfDayMin: item.decrData.readInt16LE(decrBufPos += 2),
      eventDurationMin: item.decrData.readInt32LE(decrBufPos += 2),
      notifOffsetTimeMin: item.decrData.readInt32LE(decrBufPos += 4),
      hasNotifs: item.decrData[decrBufPos += 4]!,
      isExtended: item.decrData[decrBufPos += 1]!,
      everyNDays: item.decrData.readInt16LE(decrBufPos += 1),
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 2, decrBufPos + 48), 48)
    };
  }
  return dailyReminders;
}

export function unpackWeeklyReminders(repeatedData: Buffer, recordCount: number) {
  const weeklyReminders: WeeklyReminder[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 96);
    bufPos += 112;

    let decrBufPos = 0;
    weeklyReminders[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      eventType: item.decrData.readInt32LE(decrBufPos += 8),
      seriesStartYear: item.decrData.readInt32LE(decrBufPos += 4),
      seriesStartDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesStartMin: item.decrData.readInt16LE(decrBufPos += 2),
      seriesEndYear: item.decrData.readInt32LE(decrBufPos += 2),
      seriesEndDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesEndMin: item.decrData.readInt16LE(decrBufPos += 2),
      timeOfDayMin: item.decrData.readInt16LE(decrBufPos += 2),
      eventDurationMin: item.decrData.readInt32LE(decrBufPos += 2),
      notifOffsetTimeMin: item.decrData.readInt32LE(decrBufPos += 4),
      hasNotifs: item.decrData[decrBufPos += 4]!,
      isExtended: item.decrData[decrBufPos += 1]!,
      everyNWeeks: item.decrData.readInt16LE(decrBufPos += 1),
      daysOfWeek: unpackDaysOfWeek(item.decrData.subarray(decrBufPos += 2, decrBufPos + 1)),
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 1, decrBufPos + 48), 48) // only incr by 1 since daysOfWeek is stored on server as 1 byte
    };
  }
  return weeklyReminders;
}

export function unpackMonthlyReminders(repeatedData: Buffer, recordCount: number) {
  const monthlyReminders: MonthlyReminder [] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 96);
    bufPos += 112;

    let decrBufPos = 0;
    monthlyReminders[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      eventType: item.decrData.readInt32LE(decrBufPos += 8),
      seriesStartYear: item.decrData.readInt32LE(decrBufPos += 4),
      seriesStartDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesStartMin: item.decrData.readInt16LE(decrBufPos += 2),
      seriesEndYear: item.decrData.readInt32LE(decrBufPos += 2),
      seriesEndDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesEndMin: item.decrData.readInt16LE(decrBufPos += 2),
      timeOfDayMin: item.decrData.readInt16LE(decrBufPos += 2),
      eventDurationMin: item.decrData.readInt32LE(decrBufPos += 2),
      notifOffsetTimeMin: item.decrData.readInt32LE(decrBufPos += 4),
      hasNotifs: item.decrData[decrBufPos += 4]!,
      isExtended: item.decrData[decrBufPos += 1]!,
      lastDayOfMonth: item.decrData[decrBufPos += 1]!,
      daysOfMonth: unpackDaysOfMonth(item.decrData.subarray(decrBufPos += 1, decrBufPos + 4)),
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 4, decrBufPos + 48), 48) // only incr by 4 since daysOfWeek is stored on server as 4 bytes
    };
  }
  return monthlyReminders;
}

export function unpackYearlyReminders(repeatedData: Buffer, recordCount: number) {
  const yearlyReminders: YearlyReminder[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 96);
    bufPos += 112;

    let decrBufPos = 0;
    yearlyReminders[i] = {
      itemID: item.itemID,
      lastModified: item.lastModified,
      folderID: item.decrData.readBigInt64LE(decrBufPos),
      eventType: item.decrData.readInt32LE(decrBufPos += 8),
      seriesStartYear: item.decrData.readInt32LE(decrBufPos += 4),
      seriesStartDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesStartMin: item.decrData.readInt16LE(decrBufPos += 2),
      seriesEndYear: item.decrData.readInt32LE(decrBufPos += 2),
      seriesEndDay: item.decrData.readInt16LE(decrBufPos += 4),
      seriesEndMin: item.decrData.readInt16LE(decrBufPos += 2),
      timeOfDayMin: item.decrData.readInt16LE(decrBufPos += 2),
      eventDurationMin: item.decrData.readInt32LE(decrBufPos += 2),
      notifOffsetTimeMin: item.decrData.readInt32LE(decrBufPos += 4),
      hasNotifs: item.decrData[decrBufPos += 4]!,
      isExtended: item.decrData[decrBufPos += 1]!,
      dayOfYear: item.decrData.readInt16LE(decrBufPos += 1),
      title: getStringFromBuf(item.decrData.subarray(decrBufPos += 2, decrBufPos + 48), 48)
    };
  }
  return yearlyReminders;
}

export function unpackExtensions(repeatedData: Buffer, recordCount: number) {
  const extensions: Extension[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const itemID = repeatedData.readBigInt64LE(bufPos);
    bufPos += 8;
    const lastModified = repeatedData.readBigInt64LE(bufPos);
    bufPos += 8;
    const sequenceNum = repeatedData.readInt32LE(bufPos);
    bufPos += 4;
    const decrData = decrypt(repeatedData.subarray(bufPos, bufPos + 64), getPrivateKey1(), getPrivateKey1());
    bufPos += 64;

    extensions[i] = {
      itemID: itemID,
      lastModified: lastModified,
      sequenceNum: sequenceNum,
      data: getStringFromBuf(decrData, 64)
    };
  }
  return extensions;
}

export function unpackFolders(repeatedData: Buffer, recordCount: number) {
  const folders: Folder[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    const item = getItemDetailsFromBuf(repeatedData, bufPos, 64);
    bufPos += 80;

    let decrBufPos = 0;
    folders[i] = {
      folderID: item.itemID,
      lastModified: item.lastModified,
      parentFolderID: item.decrData.readBigInt64LE(decrBufPos),
      colorCode: item.decrData.readInt32LE(decrBufPos += 8),
      folderName: getStringFromBuf(item.decrData.subarray(decrBufPos += 4, decrBufPos + 24), 24)
    };
  }
  return folders;
}

export function unpackDeleted(repeatedData: Buffer, recordCount: number) {
  const deletes: Deleted[] = new Array(recordCount);
  let bufPos = 0;

  for (let i = 0; i < recordCount; i++) {
    deletes[i] = {
      itemID: repeatedData.readBigInt64LE(bufPos),
      lastModified: repeatedData.readBigInt64LE(bufPos + 8),
      itemTable: repeatedData.readInt16LE(bufPos + 16)
    };
    bufPos += 18;
  }
  return deletes;
}

// convert 6 Extensions into a single Flight
export function unpackFlight(data: Extension[]) {
  if (data.length != 6) return undefined;
  const ext1 = data[0]!.data;
  const ext2 = data[1]!.data;
  const ext3 = data[2]!.data;
  const ext4 = data[3]!.data;
  const ext5 = data[4]!.data;
  const ext6 = data[5]!.data;
  const flight: Flight = {
    itemID: data[0]!.itemID,
    lastModified: data[0]!.lastModified,
    depAirportName: ext1,
    depAirportAddress: ext2,
    arrAirportName: ext3,
    arrAirportAddress: ext4,
    airlineCode: ext5.substring(0, 8),
    flightNumber: ext5.substring(8, 16),
    airlineName: ext5.substring(16, 64),
    depAirportIATA: ext6.substring(0, 3),
    depTimezoneAbbr: ext6.substring(3, 8),
    depTimeYear: Number(Buffer.from(ext6.substring(8, 12)).readInt32LE(0)),
    depTimeDay: Number(Buffer.from(ext6.substring(12, 14)).readInt16LE(0)),
    depTimeMin: Number(Buffer.from(ext6.substring(14, 16)).readInt16LE(0)),
    depTimeDestZoneYear: Number(Buffer.from(ext6.substring(16, 20)).readInt32LE(0)),
    depTimeDestZoneDay: Number(Buffer.from(ext6.substring(20, 22)).readInt16LE(0)),
    depTimeDestZoneMin: Number(Buffer.from(ext6.substring(22, 24)).readInt16LE(0)),
    boardingTimeYear: Number(Buffer.from(ext6.substring(24, 28)).readInt32LE(0)),
    boardingTimeDay: Number(Buffer.from(ext6.substring(28, 30)).readInt16LE(0)),
    boardingTimeMin: Number(Buffer.from(ext6.substring(30, 32)).readInt16LE(0)),
    boardingGroup: ext6.substring(32, 34),
    gate: ext6.substring(34, 38),
    depTimezoneOffset: ext6.substring(38, 39),
    arrTimezoneOffset: ext6.substring(39, 40),
    arrAirportIATA: ext6.substring(40, 43),
    arrTimezoneAbbr: ext6.substring(43, 48),
    arrTimeYear: Number(Buffer.from(ext6.substring(48, 52)).readInt32LE(0)),
    arrTimeDay: Number(Buffer.from(ext6.substring(52, 54)).readInt16LE(0)),
    arrTimeMin: Number(Buffer.from(ext6.substring(54, 56)).readInt16LE(0)),
    arrTimeDestZoneYear: Number(Buffer.from(ext6.substring(56, 60)).readInt32LE(0)),
    arrTimeDestZoneDay: Number(Buffer.from(ext6.substring(60, 62)).readInt16LE(0)),
    arrTimeDestZoneMin: Number(Buffer.from(ext6.substring(62, 64)).readInt16LE(0))
  };
  return flight;
}

// convert 4 Extensions to a single Hotel
export function unpackHotel(data: Extension[]) {
  if (data.length != 4) return undefined;
  const ext1 = data[0]!.data;
  const ext2 = data[1]!.data;
  const ext3 = data[2]!.data;
  const ext4 = data[3]!.data;
  const hotel: Hotel = {
    itemID: data[0]!.itemID,
    lastModified: data[0]!.lastModified,
    name: ext1,
    address: ext2 + ext3,
    checkinTimeYear: Number(Buffer.from(ext4.substring(0, 4)).readInt32LE(0)),
    checkinTimeDay: Number(Buffer.from(ext4.substring(4, 6)).readInt16LE(0)),
    checkinTimeMin: Number(Buffer.from(ext4.substring(6, 8)).readInt16LE(0)),
    checkoutTimeYear: Number(Buffer.from(ext4.substring(8, 12)).readInt32LE(0)),
    checkoutTimeDay: Number(Buffer.from(ext4.substring(12, 14)).readInt16LE(0)),
    checkoutTimeMin: Number(Buffer.from(ext4.substring(14, 16)).readInt16LE(0)),
    timezoneAbbrev: ext4.substring(16, 21),
    timezoneOffset: ext4.substring(21, 22),
    roomNumber: ext4.substring(22, 32)
  };
  return hotel;
}

// helpers

interface ItemDetails{
  itemID: bigint,
  lastModified: bigint,
  decrData: Buffer
}

interface ServerLastUp {
  lastUpNotes: bigint;
  lastUpReminders: bigint;
  lastUpDaily: bigint;
  lastUpWeekly: bigint;
  lastUpMonthly: bigint;
  lastUpYearly: bigint;
  lastUpExtensions: bigint;
  lastUpOverrides: bigint;
  lastUpFolders: bigint;
  lastUpDeleted: bigint;
}

function getItemDetailsFromBuf(repeatedData: Buffer, bufPos: number, encrSize: number) {
  const itemDetails: ItemDetails = {
    itemID: repeatedData.readBigInt64LE(bufPos),
    lastModified: repeatedData.readBigInt64LE(bufPos += 8),
    decrData: decrypt(repeatedData.subarray(bufPos += 8, bufPos + encrSize), getPrivateKey1(), getPrivateKey1())
  }
  return itemDetails;
}

function getStringFromBuf(buffer: Buffer, size: number) { // returns string until end or null terminator
  const nullTermPos = buffer.indexOf(0x00);
  size = (nullTermPos < size && nullTermPos !== -1) ? nullTermPos : size;
  return buffer.toString('utf8', 0, size);
}

function unpackDaysOfWeek(buffer: Buffer) {
  const byte = buffer.readUint8(0);
  return byte.toString(2).padStart(7, '0');
}

function unpackDaysOfMonth(buffer: Buffer) {
  const bytes = buffer.readUint32BE(0);
  return bytes.toString(2).padStart(31, '0');
}
