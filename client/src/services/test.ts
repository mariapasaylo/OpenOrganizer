/*
 * Authors: Michael Jagiello
 * Created: 2025-11-04
 * Updated: 2025-11-13
 *
 * This file defines the entry testing suite function and the function used to test the Renderer.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import { convertTimeAndDateToTimestamp } from "src/frontend-utils/time";
import * as validate from "../utils/validate"
import * as eventtypes from "../utils/eventtypes"

export function TestingSuite() {
  TestingSuiteRenderer();
  //TestingSuiteElectron();
}

function TestingSuiteRenderer() {
  Test_ValidateUsername();
  Test_ValidatePassword();
  Test_Flight();
  Test_Hotel();
  let successes = 0;
  for (const b of results) {
    if (b) successes++;
  }
  console.log("Passed", successes, "of", results.length, "checks in the renderer.");
}

const results: boolean[] = [];

function Test(expected: boolean, result: string | boolean, prefix?: string) {
  if (prefix == undefined) prefix = "";
  if (typeof result === "string") {
    if (result == "") {
      results.push(expected);
    }
    else {
      console.log(prefix + result);
      results.push(!expected);
    }
  }
  else if (typeof result === "boolean") {
    results.push(expected == result);
    if (expected != result) console.log(prefix);
  }
}

// test cases

function Test_ValidateUsername() {
  const errPrefix = "Test_ValidateUsername: ";
  let username = "";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "u";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "usernam";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "username";
  Test(true, validate.ValidateUsername(username), errPrefix);
  username = "usernameusernameusernameusername";
  Test(true, validate.ValidateUsername(username), errPrefix);
  username = "usernameusernameusernameusername1";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "username ";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "use name";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "user'ame";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "usern\"me";
  Test(false, validate.ValidateUsername(username), errPrefix);
  username = "userna\0e";
  Test(false, validate.ValidateUsername(username), errPrefix);
}

function Test_ValidatePassword() {
  const errPrefix = "Test_ValidatePassword: ";
  let password = "";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "p";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "passwor";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "password";
  Test(true, validate.ValidatePassword(password), errPrefix);
  password = "passwordpasswordpasswordpassword";
  Test(true, validate.ValidatePassword(password), errPrefix);
  password = "passwordpasswordpasswordpassword1";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "password ";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "pas word";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "pass'ord";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "passw\"rd";
  Test(false, validate.ValidatePassword(password), errPrefix);
  password = "passwo\0d";
  Test(false, validate.ValidatePassword(password), errPrefix);
}

function Test_Flight() {
  const depAirportName = "departure airport name";
  const depAirportAddress = "departure airport address";
  const arrAirportName = "arrival airport name";
  const arrAirportAddress = "arrival airport address";
  const airlineCode = "air code";
  const flightNumber = "flight #";
  const airlineName = "airliner";
  const depAirportIATA = "ABC";
  const depTimezoneAbbr = "ABCDE";
  const depTime = convertTimeAndDateToTimestamp("1999-12-31", "23:59");
  const depTimeDestZone = convertTimeAndDateToTimestamp("2000-12-31", "00:00");
  const boardingTime = convertTimeAndDateToTimestamp("1900-07-07", "07:00");
  const boardingGroup = "12";
  const gate = "A12";
  const depTimezoneOffset = "\x08";
  const arrTimezoneOffset = "\xF8";
  const arrAirportIATA = "CBA";
  const arrTimezoneAbbr = "EDCBA";
  const arrTime = convertTimeAndDateToTimestamp("2050-04-30", "06:59");
  const arrTimeDestZone = convertTimeAndDateToTimestamp("2100-12-31", "12:01");
  let flight = eventtypes.FieldsToFlight(depAirportName, depAirportAddress, arrAirportName, arrAirportAddress,
    airlineCode, flightNumber, airlineName, depAirportIATA, depTimezoneAbbr, depTime, depTimeDestZone, boardingTime, boardingGroup, gate,
    depTimezoneOffset, arrTimezoneOffset, arrAirportIATA, arrTimezoneAbbr, arrTime, arrTimeDestZone);
  Test(true, flight != undefined, "flight is undefined");
  if (flight == undefined) flight = eventtypes.FieldsToFlight();
  flight = flight!;
  const expectedYear1 = 1999, expectedDay1 = 365, expectedMin1 = 1439;
  const expectedYear2 = 2000, expectedDay2 = 366, expectedMin2 = 0;
  const expectedYear3 = 1900, expectedDay3 = 188, expectedMin3 = 420;
  const expectedYear4 = 2050, expectedDay4 = 120, expectedMin4 = 419;
  const expectedYear5 = 2100, expectedDay5 = 365, expectedMin5 = 721;
  Test(true, validate.MatchStrings(depAirportName, flight.depAirportName, "depAirportName"));
  Test(true, validate.MatchStrings(depAirportAddress, flight.depAirportAddress, "depAirportAddress"));
  Test(true, validate.MatchStrings(arrAirportName, flight.arrAirportName, "arrAirportName"));
  Test(true, validate.MatchStrings(arrAirportAddress, flight.arrAirportAddress, "arrAirportAddress"));
  Test(true, validate.MatchStrings(airlineCode, flight.airlineCode, "airlineCode"));
  Test(true, validate.MatchStrings(flightNumber, flight.flightNumber, "flightNumber"));
  Test(true, validate.MatchStrings(airlineName, flight.airlineName, "airlineName"));
  Test(true, validate.MatchStrings(depAirportIATA, flight.depAirportIATA, "depAirportIATA"));
  Test(true, validate.MatchStrings(depTimezoneAbbr, flight.depTimezoneAbbr, "depTimezoneAbbr"));
  Test(true, flight.depTimeYear == expectedYear1, "depTimeYear does not match");
  Test(true, flight.depTimeDay == expectedDay1, "depTimeDay does not match");
  Test(true, flight.depTimeMin == expectedMin1, "depTimeMin does not match");
  Test(true, flight.depTimeDestZoneYear == expectedYear2, "depTimeDestZoneYear does not match");
  Test(true, flight.depTimeDestZoneDay == expectedDay2, "depTimeDestZoneDay does not match");
  Test(true, flight.depTimeDestZoneMin == expectedMin2, "depTimeDestZoneMin does not match");
  Test(true, flight.boardingTimeYear == expectedYear3, "boardingTimeYear does not match");
  Test(true, flight.boardingTimeDay == expectedDay3, "boardingTimeDay does not match");
  Test(true, flight.boardingTimeMin == expectedMin3, "boardingTimeMin does not match");
  Test(true, validate.MatchStrings(boardingGroup, flight.boardingGroup, "boardingGroup"));
  Test(true, validate.MatchStrings(gate, flight.gate, "gate"));
  Test(true, validate.MatchStrings(depTimezoneOffset, flight.depTimezoneOffset, "depTimezoneOffset"));
  Test(true, validate.MatchStrings(arrTimezoneOffset, flight.arrTimezoneOffset, "arrTimezoneOffset"));
  Test(true, validate.MatchStrings(arrAirportIATA, flight.arrAirportIATA, "arrAirportIATA"));
  Test(true, validate.MatchStrings(arrTimezoneAbbr, flight.arrTimezoneAbbr, "arrTimezoneAbbr"));
  Test(true, flight.arrTimeYear == expectedYear4, "arrTimeYear does not match");
  Test(true, flight.arrTimeDay == expectedDay4, "arrTimeDay does not match");
  Test(true, flight.arrTimeMin == expectedMin4, "arrTimeMin does not match");
  Test(true, flight.arrTimeDestZoneYear == expectedYear5, "arrTimeDestZoneYear does not match");
  Test(true, flight.arrTimeDestZoneDay == expectedDay5, "arrTimeDestZoneDay does not match");
  Test(true, flight.arrTimeDestZoneMin == expectedMin5, "arrTimeDestZoneMin does not match");

  let extensions = eventtypes.FlightToExtensions(flight);
  Test(true, extensions != undefined && extensions.length == 6, "extensions is undefined or wrong length");
  if (extensions == undefined) extensions = [];
  Test(true, extensions[0]!.data.length == 64 && extensions[1]!.data.length == 64 && extensions[2]!.data.length == 64 && 
    extensions[3]!.data.length == 64 && extensions[4]!.data.length == 64 && extensions[5]!.data.length == 64, "one or more extensions have wrong data length");
  // skipping doing extensions checking

  let flightExt = eventtypes.ExtensionsToFlight(extensions);
  Test(true, flightExt != undefined, "flightExt is undefined");
  if (flightExt == undefined) flightExt = eventtypes.FieldsToFlight()!;
  Test(true, validate.MatchStrings(depAirportName, flightExt.depAirportName, "depAirportName"));
  Test(true, validate.MatchStrings(depAirportAddress, flightExt.depAirportAddress, "depAirportAddress"));
  Test(true, validate.MatchStrings(arrAirportName, flightExt.arrAirportName, "arrAirportName"));
  Test(true, validate.MatchStrings(arrAirportAddress, flightExt.arrAirportAddress, "arrAirportAddress"));
  Test(true, validate.MatchStrings(airlineCode, flightExt.airlineCode, "airlineCode"));
  Test(true, validate.MatchStrings(flightNumber, flightExt.flightNumber, "flightNumber"));
  Test(true, validate.MatchStrings(airlineName, flightExt.airlineName, "airlineName"));
  Test(true, validate.MatchStrings(depAirportIATA, flightExt.depAirportIATA, "depAirportIATA"));
  Test(true, validate.MatchStrings(depTimezoneAbbr, flightExt.depTimezoneAbbr, "depTimezoneAbbr"));
  Test(true, flightExt.depTimeYear == expectedYear1, "depTimeYear does not match");
  Test(true, flightExt.depTimeDay == expectedDay1, "depTimeDay does not match");
  Test(true, flightExt.depTimeMin == expectedMin1, "depTimeMin does not match");
  Test(true, flightExt.depTimeDestZoneYear == expectedYear2, "depTimeDestZoneYear does not match");
  Test(true, flightExt.depTimeDestZoneDay == expectedDay2, "depTimeDestZoneDay does not match");
  Test(true, flightExt.depTimeDestZoneMin == expectedMin2, "depTimeDestZoneMin does not match");
  Test(true, flightExt.boardingTimeYear == expectedYear3, "boardingTimeYear does not match");
  Test(true, flightExt.boardingTimeDay == expectedDay3, "boardingTimeDay does not match");
  Test(true, flightExt.boardingTimeMin == expectedMin3, "boardingTimeMin does not match");
  Test(true, validate.MatchStrings(boardingGroup, flightExt.boardingGroup, "boardingGroup"));
  Test(true, validate.MatchStrings(gate, flightExt.gate, "gate"));
  Test(true, validate.MatchStrings(depTimezoneOffset, flightExt.depTimezoneOffset, "depTimezoneOffset"));
  Test(true, validate.MatchStrings(arrTimezoneOffset, flightExt.arrTimezoneOffset, "arrTimezoneOffset"));
  Test(true, validate.MatchStrings(arrAirportIATA, flightExt.arrAirportIATA, "arrAirportIATA"));
  Test(true, validate.MatchStrings(arrTimezoneAbbr, flightExt.arrTimezoneAbbr, "arrTimezoneAbbr"));
  Test(true, flightExt.arrTimeYear == expectedYear4, "arrTimeYear does not match");
  Test(true, flightExt.arrTimeDay == expectedDay4, "arrTimeDay does not match");
  Test(true, flightExt.arrTimeMin == expectedMin4, "arrTimeMin does not match");
  Test(true, flightExt.arrTimeDestZoneYear == expectedYear5, "arrTimeDestZoneYear does not match");
  Test(true, flightExt.arrTimeDestZoneDay == expectedDay5, "arrTimeDestZoneDay does not match");
  Test(true, flightExt.arrTimeDestZoneMin == expectedMin5, "arrTimeDestZoneMin does not match");
}

function Test_Hotel() {
  const hotelName = "hotel name";
  const hotelAddress = "hotel address";
  const checkinTime = convertTimeAndDateToTimestamp("2001-01-01", "00:00");
  const checkoutTime = convertTimeAndDateToTimestamp("2002-07-01", "14:08");
  const timezoneAbbrev = "ET";
  const timezoneOffset = "\x04";
  const roomNumber = "216";
  let hotel = eventtypes.FieldsToHotel(hotelName, hotelAddress, checkinTime, checkoutTime, timezoneAbbrev, timezoneOffset, roomNumber);
  Test(true, hotel != undefined, "hotel is undefined");
  if (hotel == undefined) hotel = eventtypes.FieldsToHotel();
  hotel = hotel!;
  const expectedYear1 = 2001, expectedDay1 = 1, expectedMin1 = 0;
  const expectedYear2 = 2002, expectedDay2 = 182, expectedMin2 = 848;
  Test(true, validate.MatchStrings(hotelName, hotel.name, "hotelName"));
  Test(true, validate.MatchStrings(hotelAddress, hotel.address, "hotelAddress"));
  Test(true, hotel.checkinTimeYear == expectedYear1, "checkinTimeYear does not match");
  Test(true, hotel.checkinTimeDay == expectedDay1, "checkinTimeDay does not match");
  Test(true, hotel.checkinTimeMin == expectedMin1, "checkinTimeMin does not match");
  Test(true, hotel.checkoutTimeYear == expectedYear2, "checkoutTimeYear does not match");
  Test(true, hotel.checkoutTimeDay == expectedDay2, "checkoutTimeDay does not match");
  Test(true, hotel.checkoutTimeMin == expectedMin2, "checkoutTimeMin does not match");
  Test(true, validate.MatchStrings(timezoneAbbrev, hotel.timezoneAbbrev, "timezoneAbbrev"));
  Test(true, validate.MatchStrings(timezoneOffset, hotel.timezoneOffset, "timezoneOffset"));
  Test(true, validate.MatchStrings(roomNumber, hotel.roomNumber, "roomNumber"));

  let extensions = eventtypes.HotelToExtensions(hotel);
  Test(true, extensions != undefined && extensions.length == 4, "extensions is undefined or wrong length");
  if (extensions == undefined) extensions = [];
  Test(true, extensions[0]!.data.length == 64 && extensions[1]!.data.length == 64 && extensions[2]!.data.length == 64 && extensions[3]!.data.length == 64, "one or more extensions have wrong data length");
  const expectedYear1Str = "\xD1\x07\x00\x00", expectedDay1Str = "\x01\x00", expectedMin1Str = "\x00\x00";
  const expectedYear2Str = "\xD2\x07\x00\x00", expectedDay2Str = "\xB6\x00", expectedMin2Str = "\x50\x03";
  Test(true, validate.MatchStrings(validate.PadString(hotelName, 64), extensions[0]!.data, "hotelName"));
  Test(true, validate.MatchStrings(validate.PadString(hotelAddress, 128).substring(0, 64), extensions[1]!.data, "hotelAddress"));
  Test(true, validate.MatchStrings(validate.PadString(hotelAddress, 128).substring(64, 128), extensions[2]!.data, "hotelAddress"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(0, 4), expectedYear1Str, "checkinTimeYear"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(4, 6), expectedDay1Str, "checkinTimeDay"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(6, 8), expectedMin1Str, "checkinTimeMin"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(8, 12), expectedYear2Str, "checkoutTimeYear"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(12, 14), expectedDay2Str, "checkoutTimeDay"));
  Test(true, validate.MatchStrings(extensions[3]!.data.substring(14, 16), expectedMin2Str, "checkoutTimeMin"));
  Test(true, validate.MatchStrings(validate.PadString(timezoneAbbrev, 5), extensions[3]!.data.substring(16, 21), "timezoneAbbrev"));
  Test(true, validate.MatchStrings(validate.PadString(timezoneOffset, 1), extensions[3]!.data.substring(21, 22), "timezoneOffset"));
  Test(true, validate.MatchStrings(validate.PadString(roomNumber, 10), extensions[3]!.data.substring(22, 32), "roomNumber"));

  let hotelExt = eventtypes.ExtensionsToHotel(extensions);
  Test(true, hotelExt != undefined, "hotelExt is undefined");
  if (hotelExt == undefined) hotelExt = eventtypes.FieldsToHotel()!;
  Test(true, validate.MatchStrings(hotelName, hotelExt.name, "hotelName"));
  Test(true, validate.MatchStrings(hotelAddress, hotelExt.address, "hotelAddress"));
  Test(true, hotelExt.checkinTimeYear == expectedYear1, "checkinTimeYear does not match");
  Test(true, hotelExt.checkinTimeDay == expectedDay1, "checkinTimeDay does not match");
  Test(true, hotelExt.checkinTimeMin == expectedMin1, "checkinTimeMin does not match");
  Test(true, hotelExt.checkoutTimeYear == expectedYear2, "checkoutTimeYear does not match");
  Test(true, hotelExt.checkoutTimeDay == expectedDay2, "checkoutTimeDay does not match");
  Test(true, hotelExt.checkoutTimeMin == expectedMin2, "checkoutTimeMin does not match");
  Test(true, validate.MatchStrings(timezoneAbbrev, hotelExt.timezoneAbbrev, "timezoneAbbrev"));
  Test(true, validate.MatchStrings(timezoneOffset, hotelExt.timezoneOffset, "timezoneOffset"));
  Test(true, validate.MatchStrings(roomNumber, hotelExt.roomNumber, "roomNumber"));
}
