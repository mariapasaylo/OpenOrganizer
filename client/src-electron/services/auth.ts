/*
 * Authors: Kevin Sirantoine, Maria Pasaylo
 * Created: 2025-10-07
 * Updated: 2025-10-20
 *
 * This file contains functions related to user authentication including getters 
 * and setters for privateKey, username, password, and authToken.
 * This file will eventually contain login and account creation functions.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import {hash256, hash512_256, generatePrivateKey, encrypt} from "app/src-electron/services/crypto";
import Store from 'electron-store';
import type {Schema} from 'electron-store';

interface Account{ 
  username: string;
  password: string;
  privateKey: Buffer;
  authToken: Buffer;
}

const accountSchema: Schema<Account> ={
  username: {
    type: 'string',
    default: 'AlGator'
  },
  password:{
    type: 'string',
    default: ''
  },
  privateKey: {
    type: 'object',
    default: Buffer.alloc(32)
  },
  authToken:{
    type: 'object',
    default: Buffer.alloc(32)
  }
}

const accountStore = new Store<Account>({
  schema: accountSchema,
  name: 'userAccount'
});

function getUsername() {
  return accountStore.get('username');
}

function setUsername(username : string) {
  accountStore.set('username', username);
}

function getPassword() {
  return accountStore.get('password');
}

function setPassword(password : string) {
  accountStore.set('password', password);
}

function getAuthToken() {
  return accountStore.get('authToken');
}

function setAuthToken(authToken : Buffer) {
  accountStore.set('authToken', authToken);
}

function getPrivateKey() {
  return accountStore.get('privateKey');
}

function setPrivateKey(privateKey : Buffer) {
  accountStore.set('privateKey', privateKey);
}

export async function createAccount(username : string, password : string): Promise<boolean> {
  // hash password, generate and store privateKey, encrypt privateKey with SHA256(password)
  setUsername(username);
  setPassword(password);
  setPrivateKey(generatePrivateKey());
  const hashKeyPassword: Buffer = hash256(password);
  const hashServerPassword: Buffer = hash512_256(password);
  const encryptedPrivateKey: Buffer = encrypt(getPrivateKey(), hashKeyPassword, Buffer.alloc(16, 0));
  // send API request to /register
  
  return true;
}
