/*
 * Authors: Kevin Sirantoine, Michael Jagiello
 * Created: 2025-10-28
 * Updated: 2025-11-05
 *
 * This file defines functions for converting interface arrays into byte arrays for use in syncup.ts POST requests.
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
import {encrypt} from "app/src-electron/services/crypto";
import {getPrivateKey1} from "app/src-electron/services/auth";

export function packNotes(notes: Note[]) {
  const repeatedData = Buffer.alloc(notes.length * 144);
  let bufPos = 0;
  for (let i = 0; i < notes.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(notes[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(notes[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(128);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(notes[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData[encrBufPos] = notes[i]!.isExtended;
    encrBufPos += 1;
    encrData.write(notes[i]!.title, encrBufPos);
    encrBufPos += 48;
    encrData.write(notes[i]!.text, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packReminders(reminders: Reminder[]) {
  const repeatedData = Buffer.alloc(reminders.length * 112);
  let bufPos = 0;
  for (let i = 0; i < reminders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(reminders[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(reminders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(96);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(reminders[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(reminders[i]!.eventType, encrBufPos);
    encrBufPos += 4;

    encrBufPos = packEventTimes(encrData, reminders[i]!, encrBufPos);

    encrData[encrBufPos] = reminders[i]!.isExtended;
    encrBufPos += 1;
    encrData[encrBufPos] = reminders[i]!.hasNotif;
    encrBufPos += 1;
    encrData.write(reminders[i]!.title, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packDailyReminders(dailyReminders: DailyReminder[]) {
  const repeatedData = Buffer.alloc(dailyReminders.length * 112);
  let bufPos = 0;
  for (let i = 0; i < dailyReminders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(dailyReminders[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(dailyReminders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(96);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(dailyReminders[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(dailyReminders[i]!.eventType, encrBufPos);
    encrBufPos += 4;

    encrBufPos = packSeriesTimes(encrData, dailyReminders[i]!, encrBufPos);

    encrData.writeInt16LE(dailyReminders[i]!.timeOfDayMin, encrBufPos);
    encrBufPos += 2;
    encrData.writeInt32LE(dailyReminders[i]!.eventDurationMin, encrBufPos);
    encrBufPos += 4;
    encrData.writeInt32LE(dailyReminders[i]!.notifOffsetTimeMin, encrBufPos);
    encrBufPos += 4;
    encrData[encrBufPos] = dailyReminders[i]!.hasNotifs;
    encrBufPos += 1;
    encrData[encrBufPos] = dailyReminders[i]!.isExtended;
    encrBufPos += 1;
    encrData.writeInt16LE(dailyReminders[i]!.everyNDays, encrBufPos);
    encrBufPos += 2;
    encrData.write(dailyReminders[i]!.title, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packWeeklyReminders(weeklyReminders: WeeklyReminder[]) {
  const repeatedData = Buffer.alloc(weeklyReminders.length * 112);
  let bufPos = 0;
  for (let i = 0; i < weeklyReminders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(weeklyReminders[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(weeklyReminders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(96);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(weeklyReminders[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(weeklyReminders[i]!.eventType, encrBufPos);
    encrBufPos += 4;

    encrBufPos = packSeriesTimes(encrData, weeklyReminders[i]!, encrBufPos);

    encrData.writeInt16LE(weeklyReminders[i]!.timeOfDayMin, encrBufPos);
    encrBufPos += 2;
    encrData.writeInt32LE(weeklyReminders[i]!.eventDurationMin, encrBufPos);
    encrBufPos += 4;
    encrData.writeInt32LE(weeklyReminders[i]!.notifOffsetTimeMin, encrBufPos);
    encrBufPos += 4;
    encrData[encrBufPos] = weeklyReminders[i]!.hasNotifs;
    encrBufPos += 1;
    encrData[encrBufPos] = weeklyReminders[i]!.isExtended;
    encrBufPos += 1;
    encrData.writeInt16LE(weeklyReminders[i]!.everyNWeeks, encrBufPos);
    encrBufPos += 2;
    packDaysOfWeek(weeklyReminders[i]!.daysOfWeek).copy(encrData, encrBufPos);
    encrBufPos += 1;
    encrData.write(weeklyReminders[i]!.title, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packMonthlyReminders(monthlyReminders: MonthlyReminder[]) {
  const repeatedData = Buffer.alloc(monthlyReminders.length * 112);
  let bufPos = 0;
  for (let i = 0; i < monthlyReminders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(monthlyReminders[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(monthlyReminders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(96);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(monthlyReminders[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(monthlyReminders[i]!.eventType, encrBufPos);
    encrBufPos += 4;

    encrBufPos = packSeriesTimes(encrData, monthlyReminders[i]!, encrBufPos);

    encrData.writeInt16LE(monthlyReminders[i]!.timeOfDayMin, encrBufPos);
    encrBufPos += 2;
    encrData.writeInt32LE(monthlyReminders[i]!.eventDurationMin, encrBufPos);
    encrBufPos += 4;
    encrData.writeInt32LE(monthlyReminders[i]!.notifOffsetTimeMin, encrBufPos);
    encrBufPos += 4;
    encrData[encrBufPos] = monthlyReminders[i]!.hasNotifs;
    encrBufPos += 1;
    encrData[encrBufPos] = monthlyReminders[i]!.isExtended;
    encrBufPos += 1;
    encrData[encrBufPos] = monthlyReminders[i]!.lastDayOfMonth;
    encrBufPos += 1;
    packDaysOfMonth(monthlyReminders[i]!.daysOfMonth).copy(encrData, encrBufPos);
    encrBufPos += 4;
    encrData.write(monthlyReminders[i]!.title, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);;
    bufPos += encrData.length;
  }
  return repeatedData;
}

export function packYearlyReminders(yearlyReminders: YearlyReminder[]) {
  const repeatedData = Buffer.alloc(yearlyReminders.length * 112);
  let bufPos = 0;
  for (let i = 0; i < yearlyReminders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(yearlyReminders[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(yearlyReminders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(96);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(yearlyReminders[i]!.folderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(yearlyReminders[i]!.eventType, encrBufPos);
    encrBufPos += 4;

    encrBufPos = packSeriesTimes(encrData, yearlyReminders[i]!, encrBufPos);

    encrData.writeInt16LE(yearlyReminders[i]!.timeOfDayMin, encrBufPos);
    encrBufPos += 2;
    encrData.writeInt32LE(yearlyReminders[i]!.eventDurationMin, encrBufPos);
    encrBufPos += 4;
    encrData.writeInt32LE(yearlyReminders[i]!.notifOffsetTimeMin, encrBufPos);
    encrBufPos += 4;
    encrData[encrBufPos] = yearlyReminders[i]!.hasNotifs;
    encrBufPos += 1;
    encrData[encrBufPos] = yearlyReminders[i]!.isExtended;
    encrBufPos += 1;
    encrData.writeInt16LE(yearlyReminders[i]!.dayOfYear, encrBufPos);
    encrBufPos += 2;
    encrData.write(yearlyReminders[i]!.title, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);;
    bufPos += encrData.length;
  }
  return repeatedData;
}

export function packExtensions(extensions: Extension[]) {
  const repeatedData = Buffer.alloc(extensions.length * 84);
  let bufPos = 0;
  for (let i = 0; i < extensions.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(extensions[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(extensions[i]!.lastModified, bufPos);
    bufPos += 8;
    repeatedData.writeInt32LE(extensions[i]!.sequenceNum, bufPos);
    bufPos += 4;

    // encrypted data
    const encrData = Buffer.alloc(64);
    encrData.write(extensions[i]!.data, 0);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packFolders(folders: Folder[]) {
  const repeatedData = Buffer.alloc(folders.length * 80);
  let bufPos = 0;
  for (let i = 0; i < folders.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(folders[i]!.folderID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(folders[i]!.lastModified, bufPos);
    bufPos += 8;

    // encrypted data
    const encrData = Buffer.alloc(64);
    let encrBufPos = 0;

    encrData.writeBigInt64LE(folders[i]!.parentFolderID, encrBufPos);
    encrBufPos += 8;
    encrData.writeInt32LE(folders[i]!.colorCode , encrBufPos);
    encrBufPos += 4;
    encrData.write(folders[i]!.folderName, encrBufPos);

    encrypt(encrData,getPrivateKey1(), getPrivateKey1()).copy(repeatedData, bufPos);
    bufPos += encrData.length
  }
  return repeatedData;
}

export function packDeleted(deletes: Deleted[]) {
  const repeatedData = Buffer.alloc(deletes.length * 18);
  let bufPos = 0;
  for (let i = 0; i < deletes.length; i++) {
    // unencrypted itemID and lastModified values
    repeatedData.writeBigInt64LE(deletes[i]!.itemID, bufPos);
    bufPos += 8;
    repeatedData.writeBigInt64LE(deletes[i]!.lastModified, bufPos);
    bufPos += 8;
    repeatedData.writeInt16LE(deletes[i]!.itemTable, bufPos);
    bufPos += 2;
  }
  return repeatedData;
}

// takes a Flight and packs into 6 Extensions
// assumes all fields are of proper size
export function packFlight(flight: Flight) {
  const extensions: Extension[] = [
    {
      itemID: flight.itemID,
      sequenceNum: 1,
      lastModified: flight.lastModified,
      data: flight.depAirportName
    },
    {
      itemID: flight.itemID,
      sequenceNum: 2,
      lastModified: flight.lastModified,
      data: flight.depAirportAddress
    },
    {
      itemID: flight.itemID,
      sequenceNum: 3,
      lastModified: flight.lastModified,
      data: flight.arrAirportName
    },
    {
      itemID: flight.itemID,
      sequenceNum: 4,
      lastModified: flight.lastModified,
      data: flight.arrAirportAddress
    },
    {
      itemID: flight.itemID,
      sequenceNum: 5,
      lastModified: flight.lastModified,
      data: 
        flight.airlineCode +
        flight.flightNumber +
        flight.airlineName
    },
    {
      itemID: flight.itemID,
      sequenceNum: 6,
      lastModified: flight.lastModified,
      data:
        flight.depAirportIATA +
        flight.depTimezoneAbbr +
        packTime(flight.depTimeYear, flight.depTimeDay, flight.depTimeMin) +
        packTime(flight.depTimeDestZoneYear, flight.depTimeDestZoneDay, flight.depTimeDestZoneMin) +
        packTime(flight.boardingTimeYear, flight.boardingTimeDay, flight.boardingTimeMin) +
        flight.boardingGroup +
        flight.gate +
        flight.depTimezoneOffset +
        flight.arrTimezoneOffset +
        flight.arrAirportIATA +
        flight.arrTimezoneAbbr +
        packTime(flight.arrTimeYear, flight.arrTimeDay, flight.arrTimeMin) +
        packTime(flight.arrTimeDestZoneYear, flight.arrTimeDestZoneDay, flight.arrTimeDestZoneMin)
    }
  ];
  return extensions;
}

// takes a Hotel and packs into 4 Extensions
// assumes all fields are of proper size
export function packHotel(hotel: Hotel) {
  const extensions: Extension[] = [
    {
      itemID: hotel.itemID,
      sequenceNum: 1,
      lastModified: hotel.lastModified,
      data: hotel.name
    },
    {
      itemID: hotel.itemID,
      sequenceNum: 2,
      lastModified: hotel.lastModified,
      data: hotel.address.substring(0, 64)
    },
    {
      itemID: hotel.itemID,
      sequenceNum: 3,
      lastModified: hotel.lastModified,
      data: hotel.address.substring(64, 128)
    },
    {
      itemID: hotel.itemID,
      sequenceNum: 4,
      lastModified: hotel.lastModified,
      data:
        packTime(hotel.checkinTimeYear, hotel.checkinTimeDay, hotel.checkinTimeMin) +
        packTime(hotel.checkoutTimeYear, hotel.checkoutTimeDay, hotel.checkoutTimeMin) +
        hotel.timezoneAbbrev +
        hotel.timezoneOffset +
        hotel.roomNumber +
        "\0".repeat(32)
    }
  ];
  return extensions;
}

// helpers

function packEventTimes(encrData: Buffer, reminder : Reminder, encrBufPos: number) {
  encrData.writeInt32LE(reminder.eventStartYear, encrBufPos);
  encrBufPos += 4;
  encrData.writeInt16LE(reminder.eventStartDay, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt16LE(reminder.eventStartMin, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt32LE(reminder.eventEndYear, encrBufPos);
  encrBufPos += 4;
  encrData.writeInt16LE(reminder.eventEndDay, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt16LE(reminder.eventEndMin, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt32LE(reminder.notifYear, encrBufPos);
  encrBufPos += 4;
  encrData.writeInt16LE(reminder.notifDay, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt16LE(reminder.notifMin, encrBufPos);
  encrBufPos += 2;

  return encrBufPos;
}

function packSeriesTimes(encrData: Buffer, recurringReminder : DailyReminder | WeeklyReminder | MonthlyReminder | YearlyReminder, encrBufPos: number) {
  encrData.writeInt32LE(recurringReminder.seriesStartYear, encrBufPos);
  encrBufPos += 4;
  encrData.writeInt16LE(recurringReminder.seriesStartDay, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt16LE(recurringReminder.seriesStartMin, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt32LE(recurringReminder.seriesEndYear, encrBufPos);
  encrBufPos += 4;
  encrData.writeInt16LE(recurringReminder.seriesEndDay, encrBufPos);
  encrBufPos += 2;
  encrData.writeInt16LE(recurringReminder.seriesEndMin, encrBufPos);
  encrBufPos += 2;

  return encrBufPos;
}

function packDaysOfWeek(daysOfWeek: string) {
  const packedDoW = Buffer.alloc(1);
  packedDoW.writeUint8(parseInt(daysOfWeek, 2), 0); // turns binary string into int representation ex: "00000011" = 3
  return packedDoW;
}

function packDaysOfMonth(daysOfMonth: string) { // uses big-endian to store bits in same order
  const packedDoM = Buffer.alloc(4);
  packedDoM.writeUint32BE(parseInt(daysOfMonth, 2), 0); // turns binary string into int representation ex: "0000011111010000" = 2000
  return packedDoM;
}

// converts year+day+minute into an 8-byte string
function packTime(year: number, day: number, minute: number) {
  const result = Buffer.alloc(8);
  result.writeUint32LE(year, 0);
  result.writeUint16LE(day, 4);
  result.writeUint16LE(minute, 6);
  return result.toString();
}
