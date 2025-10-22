/*
 * Authors: Kevin Sirantoine, Maria Pasaylo
 * Created: 2025-10-07
 * Updated: 2025-10-22
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
  userId: Buffer;
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
    default: Buffer.alloc(32)
  },
  authToken:{
    type: 'object',
    default: Buffer.alloc(32)
  },
  userId:{
    type: 'object', // TO DO : fix does not like storing it as a big int
    default: Buffer.alloc(8)
  }
}

const accountStore = new Store<Account>({
  schema: accountSchema,
  name: 'accountInfo'
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
  return Buffer.from(accountStore.get('privateKey'));
}

function setPrivateKey(privateKey : Buffer) {
  accountStore.set('privateKey', privateKey);
}

function getUserId() {
  return accountStore.get('userId').readBigInt64LE(0);
} 

function setUserId(userId : Buffer) {
  accountStore.set('userId', userId);
}

export async function createAccount(username : string, password : string): Promise<boolean> {
  // hash password, generate and store privateKey, encrypt privateKey with SHA256(password)
  setUsername(username);
  setPassword(password);
  setPrivateKey(generatePrivateKey());
  const hashKeyPassword: Buffer = hash256(password);
  const hashServerPassword: Buffer = hash512_256(password);
  const encryptedPrivateKey: Buffer = encrypt(getPrivateKey(), hashKeyPassword, hashKeyPassword);
  
  // Sending in raw data via API request to /register
  const userData = Buffer.alloc(128,0);

  //Ensure username is max 32 bytes
  const usernameBuffer = Buffer.from(username).slice(0,32);
  
  //username[0:32], passwordHash[32:64], encr1[64:96], encr2[96:128]
  usernameBuffer.copy(userData, 0);
  hashServerPassword.copy(userData, 32);
  encryptedPrivateKey.copy(userData, 64);
  encryptedPrivateKey.copy(userData, 96);//Duplicate for private key 2 for now


  try{
    //TO DO: update to get env server port number variable
    const response = await fetch("http://localhost:3001/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: userData
    });

    // Parse the reponse
    const responseData = Buffer.from(await response.arrayBuffer());
    
    //console.log('Response data', responseData); //why is it length 43 instead of 40?

    //userID [0:8], authToken[8:40]
    const userIdBytes = responseData.slice(0, 8);
    const authTokenBytes = responseData.slice(8, 40);
    setAuthToken(authTokenBytes);
    setUserId(userIdBytes);
    
    
  } catch (error) {
    console.error("Error registering account:", error);
    return false;
  }

  return true;
  }
