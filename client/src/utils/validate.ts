/*
 * Authors: Michael Jagiello
 * Created: 2025-11-11
 * Updated: 2025-11-13
 *
 * This file defines helper validation functions for user inputs.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

// disallows undefined, length < minLength or length > maxLength
// returns "" upon success or an error message upon fail using the optional stringName | "string"
export function ValidateString(str: string | undefined, minLength: number, maxLength: number, stringName?: string) {
  if (stringName == undefined) stringName = "string";
  if (str == undefined) return stringName + " is undefined";
  if (str.length < minLength) return stringName + " must be at least " + minLength.toString() + " characters long";
  if (str.length > maxLength) return stringName + " must be at most "  + maxLength.toString() + " characters long";
  if (str.includes("\0")) return stringName + " must not include null terminators, and I have no clue how you pulled this off";
  return "";
}

export function MatchStrings(str1: string, str2: string, stringName?: string) {
  if (stringName == undefined) stringName = "string";
  if (str1 != str2) return stringName + " does not match";
  return "";
}

export function PadString(str: string | undefined, length: number) {
  if (str == undefined) str = "";
  return str + "\0".repeat(length - str.length);
}

export function UnpadString(str: string | undefined) {
  if (str == undefined) str = "";
  return str.replaceAll("\0", "");
}

// disallows empty, length < 8, length > 32, spaces, apostrophes (single quotes), double quotes, and nulls
// returns "" upon success or an error message upon fail
export function ValidateUsername(username: string) {
  if (username == "") return "username must not be empty";
  let ret = "";
  if ((ret = ValidateString(username, 8, 32, "username")) != "") return ret;
  if (username.includes(" ")) return "username must not include any spaces";
  if (username.includes("'")) return "username must not include any apostrophes";
  if (username.includes("\"")) return "username must not include any quotes";
  if (username.includes("\0")) return "username must not include null terminators, and I have no clue how you pulled this off";
  return "";
}

// disallows empty, length < 8, length > 32, spaces, apostrophes (single quotes), double quotes, and nulls
// returns "" upon success or an error message upon fail
export function ValidatePassword(password: string) {
  if (password == "") return "password must not be empty";
  let ret = "";
  if ((ret = ValidateString(password, 8, 32, "password")) != "") return ret;
  if (password.includes(" ")) return "password must not include any spaces";
  if (password.includes("'")) return "password must not include any apostrophes";
  if (password.includes("\"")) return "password must not include any quotes";
  if (password.includes("\0")) return "password must not include null terminators, and I have no clue how you pulled this off";
  return "";
}
