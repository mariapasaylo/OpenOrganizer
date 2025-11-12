/*
 * Authors: Michael Jagiello
 * Created: 2025-11-04
 * Updated: 2025-11-11
 *
 * This file defines the entry testing suite function and the function used to test the Renderer.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import * as validate from "../utils/validate"

export function TestingSuite() {
  TestingSuiteRenderer();
  //TestingSuiteElectron();
}

function TestingSuiteRenderer() {
  Test_ValidateUsername();
  Test_ValidatePassword();
  let successes = 0;
  for (const b of results) {
    if (b) successes++;
  }
  console.log("Passed", successes, "of", results.length, "tests in the renderer.");
}

const results: boolean[] = [];

function Test(expected: boolean, result: string, prefix: string) {
  if (result == "") {
    results.push(expected);
  }
  else {
    console.log(prefix + result);
    results.push(!expected);
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
