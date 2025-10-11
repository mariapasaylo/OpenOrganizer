/*
 * Authors: Kevin Sirantoine
 * Created: 2025-10-07
 * Updated: 2025-10-07
 *
 * This file contains functions related to user authentication including getters and setters for privateKey, username, password, and authToken.
 * This file will eventually contain login and account creation functions.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import {generatePrivateKey} from "app/src-electron/services/crypto";
// import electron-store blueprint

// todo: finish implementing this file

function getUsername() {
  // return account.get('username');
}

function setUsername(username : string) {
  // account.set('username', username);
}

function getPassword() {
  // return account.get('password');
}

function setPassword(password : string) {
  // account.set('password', password);
}

function getAuthToken() {
  // return account.get('authToken');
}

function setAuthToken(authToken : Buffer) {
  // account.set('authToken', authToken);
}

function getPrivateKey() {
  // return account.get('privateKey');
}

function setPrivateKey(privateKey : Buffer) {
  // account.set('privateKey', privateKey);
}

export function createAccount(username : string, password : string) {
  // hash password, generate and store privateKey, encrypt privateKey with SHA256(password)
  // send API request to /register
}
