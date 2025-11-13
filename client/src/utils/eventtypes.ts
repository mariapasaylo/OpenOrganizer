/*
 * Authors: Michael Jagiello
 * Created: 2025-11-06
 * Updated: 2025-11-12
 *
 * This file defines functions for converting back and forth between extensions and eventTypes, as well as helpers to convert input fields into the eventTypes.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import { getDayOfYear, type Timestamp } from '@quasar/quasar-ui-qcalendar';
import { convertTimeAndDateToTimestamp } from 'src/frontend-utils/time';
import { ValidateString, PadString } from "./validate";
import type { Extension, Flight, Hotel } from "app/src-electron/types/shared-types";

// input fields to eventType

// converts input fields into a Flight object
// note that itemID and lastModified are set to 0 and must be updated later to store with item
// pads out input string fields with '\0' to required length, and returns undefined if one of the input strings was too long
export function FieldsToFlight(depAirportName?: string, depAirportAddress?: string, arrAirportName?: string, arrAirportAddress?: string,
    airlineCode?: string, flightNumber?: string, airlineName?: string, depAirportIATA?: string, depTimezoneAbbr?: string, 
    depTime?: Timestamp, depTimeDestZone?: Timestamp, boardingTime?: Timestamp,
    boardingGroup?: string, gate?: string, depTimezoneOffset?: string, arrTimezoneOffset?: string, 
    arrAirportIATA?: string, arrTimezoneAbbr?: string, arrTime?: Timestamp, arrTimeDestZone?: Timestamp) {
  if ((depAirportName = ValidateString(depAirportName, 0, 64)) != "") return undefined;
  if ((depAirportAddress = ValidateString(depAirportAddress, 0, 64)) != "") return undefined;
  if ((arrAirportName = ValidateString(arrAirportName, 0, 64)) != "") return undefined;
  if ((arrAirportAddress = ValidateString(arrAirportAddress, 0, 64)) != "") return undefined;
  if ((airlineCode = ValidateString(airlineCode, 0, 8)) != "") return undefined;
  if ((flightNumber = ValidateString(flightNumber, 0, 8)) != "") return undefined;
  if ((airlineName = ValidateString(airlineName, 0, 48)) != "") return undefined;
  if ((depAirportIATA = ValidateString(depAirportIATA, 0, 3)) != "") return undefined;
  if ((depTimezoneAbbr = ValidateString(depTimezoneAbbr, 0, 5)) != "") return undefined;
  if ((boardingGroup = ValidateString(boardingGroup, 0, 2)) != "") return undefined;
  if ((gate = ValidateString(gate, 0, 4)) != "") return undefined;
  if ((depTimezoneOffset = ValidateString(depTimezoneOffset, 0, 1)) != "") return undefined;
  if ((arrTimezoneOffset = ValidateString(arrTimezoneOffset, 0, 1)) != "") return undefined;
  if ((arrAirportIATA = ValidateString(arrAirportIATA, 0, 3)) != "") return undefined;
  if ((arrTimezoneAbbr = ValidateString(arrTimezoneAbbr, 0, 5)) != "") return undefined;
  const flight: Flight = {
    itemID: 0n,
    lastModified: 0n,
    depAirportName: PadString(depAirportName, 64),
    depAirportAddress: PadString(depAirportAddress, 64),
    arrAirportName: PadString(arrAirportName, 64),
    arrAirportAddress: PadString(arrAirportAddress, 64),
    airlineCode: PadString(airlineCode, 8),
    flightNumber: PadString(flightNumber, 8),
    airlineName: PadString(airlineName, 48),
    depAirportIATA: PadString(depAirportIATA, 3),
    depTimezoneAbbr: PadString(depTimezoneAbbr, 5),
    depTimeYear: TimestampYear(ValidateTimestamp(depTime)),
    depTimeDay: TimestampDay(ValidateTimestamp(depTime)),
    depTimeMin: TimestampMin(ValidateTimestamp(depTime)),
    depTimeDestZoneYear: TimestampYear(ValidateTimestamp(depTimeDestZone)),
    depTimeDestZoneDay: TimestampDay(ValidateTimestamp(depTimeDestZone)),
    depTimeDestZoneMin: TimestampMin(ValidateTimestamp(depTimeDestZone)),
    boardingTimeYear: TimestampYear(ValidateTimestamp(boardingTime)),
    boardingTimeDay: TimestampDay(ValidateTimestamp(boardingTime)),
    boardingTimeMin: TimestampMin(ValidateTimestamp(boardingTime)),
    boardingGroup: PadString(boardingGroup, 2),
    gate: PadString(gate, 4),
    depTimezoneOffset: PadString(depTimezoneOffset, 1),
    arrTimezoneOffset: PadString(arrTimezoneOffset, 1),
    arrAirportIATA: PadString(arrAirportIATA, 3),
    arrTimezoneAbbr: PadString(arrTimezoneAbbr, 5),
    arrTimeYear: TimestampYear(ValidateTimestamp(arrTime)),
    arrTimeDay: TimestampDay(ValidateTimestamp(arrTime)),
    arrTimeMin: TimestampMin(ValidateTimestamp(arrTime)),
    arrTimeDestZoneYear: TimestampYear(ValidateTimestamp(arrTimeDestZone)),
    arrTimeDestZoneDay: TimestampDay(ValidateTimestamp(arrTimeDestZone)),
    arrTimeDestZoneMin: TimestampMin(ValidateTimestamp(arrTimeDestZone))
  };
  return flight;
}

// converts input fields into a Hotel object
// note that itemID and lastModified are set to 0 and must be updated later to store with item
// pads out input string fields with '\0' to required length, and returns undefined if one of the input strings was too long
export function FieldsToHotel(name?: string, address?: string, 
    checkinTime?: Timestamp, checkoutTime?: Timestamp, 
    timezoneAbbrev?: string, timezoneOffset?: string, roomNumber?: string) {
  if ((name = ValidateString(name, 0, 64)) != "") return undefined;
  if ((address = ValidateString(address, 0, 128)) != "") return undefined;
  if ((timezoneAbbrev = ValidateString(timezoneAbbrev, 0, 5)) != "") return undefined;
  if ((timezoneOffset = ValidateString(timezoneOffset, 0, 1)) != "") return undefined;
  if ((roomNumber = ValidateString(roomNumber, 0, 10)) != "") return undefined;
  const hotel: Hotel = {
    itemID: 0n,
    lastModified: 0n,
    name: PadString(name, 64),
    address: PadString(address, 128),
    checkinTimeYear: TimestampYear(ValidateTimestamp(checkinTime)),
    checkinTimeDay: TimestampDay(ValidateTimestamp(checkinTime)),
    checkinTimeMin: TimestampMin(ValidateTimestamp(checkinTime)),
    checkoutTimeYear: TimestampYear(ValidateTimestamp(checkoutTime)),
    checkoutTimeDay: TimestampDay(ValidateTimestamp(checkoutTime)),
    checkoutTimeMin: TimestampMin(ValidateTimestamp(checkoutTime)),
    timezoneAbbrev: PadString(timezoneAbbrev, 5),
    timezoneOffset: PadString(timezoneOffset, 1),
    roomNumber: PadString(roomNumber, 10)
  };
  return hotel;
}

// eventType to Extensions

// takes a Flight and packs into 6 Extensions
// assumes all fields are of proper size
export function FlightToExtensions(flight: Flight) {
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
        PackTime(flight.depTimeYear, flight.depTimeDay, flight.depTimeMin) +
        PackTime(flight.depTimeDestZoneYear, flight.depTimeDestZoneDay, flight.depTimeDestZoneMin) +
        PackTime(flight.boardingTimeYear, flight.boardingTimeDay, flight.boardingTimeMin) +
        flight.boardingGroup +
        flight.gate +
        flight.depTimezoneOffset +
        flight.arrTimezoneOffset +
        flight.arrAirportIATA +
        flight.arrTimezoneAbbr +
        PackTime(flight.arrTimeYear, flight.arrTimeDay, flight.arrTimeMin) +
        PackTime(flight.arrTimeDestZoneYear, flight.arrTimeDestZoneDay, flight.arrTimeDestZoneMin)
    }
  ];
  return extensions;
}

// takes a Hotel and packs into 4 Extensions
// assumes all fields are of proper size
export function HotelToExtensions(hotel: Hotel) {
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
        PackTime(hotel.checkinTimeYear, hotel.checkinTimeDay, hotel.checkinTimeMin) +
        PackTime(hotel.checkoutTimeYear, hotel.checkoutTimeDay, hotel.checkoutTimeMin) +
        hotel.timezoneAbbrev +
        hotel.timezoneOffset +
        hotel.roomNumber +
        "\0".repeat(32)
    }
  ];
  return extensions;
}

// Extensions to eventType

// convert 6 Extensions into a single Flight
// returns undefined if Extension array is not of proper length
export function ExtensionsToFlight(data: Extension[]) {
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
// returns undefined if Extension array is not of proper length
export function ExtensionsToHotel(data: Extension[]) {
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

function TimestampYear(time: Timestamp) {
  return time.year;
}

function TimestampDay(time: Timestamp) {
  return getDayOfYear(time);
}

function TimestampMin(time: Timestamp) {
  return (time.hour * 60) + time.minute;
}

// converts year+day+minute into an 8-byte string
function PackTime(year: number, day: number, minute: number) {
  const result = Buffer.alloc(8);
  result.writeUint32LE(year, 0);
  result.writeUint16LE(day, 4);
  result.writeUint16LE(minute, 6);
  return result.toString();
}

function ValidateBigint(int: bigint | undefined) {
  if (int == undefined) return 0n;
  return int;
}

function ValidateTimestamp(time: Timestamp | undefined) {
  if (time == undefined) return convertTimeAndDateToTimestamp("2001-01-01", "00:00");
  return time;
}
