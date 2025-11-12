/*
 * Authors: Michael Jagiello
 * Created: 2025-11-11
 * Updated: 2025-11-11
 *
 * This file defines helper validation functions for user inputs.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

// disallows empty, length < 8, length > 32, spaces, single and double quotes, and nulls
// returns true upon success or a string for error message upon fail
export function ValidateUsername(username: string) {
  if (username == "") {
    return "username must not be empty";
  }
  if (username.length < 8) {
    return "username must be at least 8 characters long";
  }
  if (username.length > 32) {
    return "username must be 32 characters long or less";
  }
  if (username.includes(" ")) {
    return "username must not include spaces";
  }
  if (username.includes("'")) {
    return "username must not include spaces";
  }
  if (username.includes("\"")) {
    return "username must not include spaces";
  }
  if (username.includes("\0")) {
    return "username must not include null terminators, and I have no clue how you pulled this off";
  }
  return "";
}

// disallows empty, length < 8, length > 32, spaces, single and double quotes, and nulls
// returns true upon success or a string for error message upon fail
export function ValidatePassword(password: string) {
  if (password == "") {
    return "password must not be empty";
  }
  if (password.length < 8) {
    return "password must be at least 8 characters long";
  }
  if (password.length > 32) {
    return "password must be 32 characters long or less";
  }
  if (password.includes(" ")) {
    return "password must not include spaces";
  }
  if (password.includes("'")) {
    return "password must not include spaces";
  }
  if (password.includes("\"")) {
    return "password must not include spaces";
  }
  if (password.includes("\0")) {
    return "password must not include null terminators, and I have no clue how you pulled this off";
  }
  return "";
}