/*
 * Authors: Maria Pasaylo
 * Created: 2025-10-07
 * Updated: 2025-11-03
 *
 * This file contains functions related to user authentication including getters
 * and setters for privateKey, username, password, and authToken.
 * This file will eventually contain login and account creation functions.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import {hash256, hash512_256, generatePrivateKey, encrypt, decrypt} from "app/src-electron/services/crypto";
import Store from 'electron-store';
import type {Schema} from 'electron-store';
import axios from 'axios';
import fs from 'fs';
import path from "path";
import {app} from 'electron';

interface Account{
  username: string;
  password: string;
  privateKey1: Buffer;
  privateKey2: Buffer;
  authToken: Buffer;
  userId: string;
}

const accountSchema: Schema<Account> ={
  username: {
    type: 'string',
    default: ''
  },
  password:{
    type: 'string',
    default: ''
  },
  privateKey1: {
    type:'object',
    default: Buffer.alloc(32)
  },
  privateKey2: {
    type:'object',
    default: Buffer.alloc(32)
  },
  authToken:{
    type: 'object',
    default: Buffer.alloc(32)
  },
  userId:{
    type: 'string',
    default: ''
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

export function getAuthToken() {
  return accountStore.get('authToken');
}

function setAuthToken(authToken : Buffer) {
  accountStore.set('authToken', authToken);
}

export function getPrivateKey1() {
  return Buffer.from(accountStore.get('privateKey1'));
}

function setPrivateKey1(privateKey : Buffer) {
  accountStore.set('privateKey1', privateKey);
}

function getPrivateKey2() {
  return Buffer.from(accountStore.get('privateKey2'));
}

function setPrivateKey2(privateKey : Buffer) {
  accountStore.set('privateKey2', privateKey);
}

export function getUserId() {
  return BigInt(accountStore.get('userId'));
}

function setUserId(userId : string) {
  accountStore.set('userId', userId);
}

function getServerURL():string {
  //in dev file is in project /public folder
  const devPath = path.join(app.getAppPath(), '..', '..', 'public', 'serveraddress.txt');

  let filePath: string;
  if (fs.existsSync(devPath)) 
    {
      filePath = devPath;
    }
  else
    {
      throw new Error("serveraddress.txt not found in dev path");
    }
  const url = fs.readFileSync(filePath, 'utf-8').trim();
  return url;
}


export async function createAccount(username : string, password : string): Promise<boolean> {
  // hash password, generate and store privateKey, encrypt privateKey with SHA256(password)
  setUsername(username);
  setPassword(password);
  setPrivateKey1(generatePrivateKey());
  const hashKeyPassword: Buffer = hash256(password);
  const hashServerPassword: Buffer = hash512_256(password);
  const encryptedPrivateKey: Buffer = encrypt(getPrivateKey1(), hashKeyPassword, hashKeyPassword);

  //Note do not send 0 for username
  const userData = Buffer.alloc(128,20);

  //Ensure username is max 32 bytes
  const usernameBuffer = Buffer.from(username).slice(0,32);

  //Store username[0:32], passwordHash[32:64], encr1[64:96], encr2[96:128] to send to server
  usernameBuffer.copy(userData, 0);
  hashServerPassword.copy(userData, 32);
  encryptedPrivateKey.copy(userData, 64);
  encryptedPrivateKey.copy(userData, 96);//Duplicate for private key 2 for now

  //Testing user data to send to server
  //console.log(getUserId(), getUserId());
  // console.log('REGISTER USER DATA', userData.toString('utf8'));
  // console.log('REGISTER USER DATA RAW', userData);
  // console.log('REGISTER USER DATA LENGTH', userData.length); 

  // Sending in raw data via API request to /register
  try{
    const serverURL = getServerURL();
    const response = await axios.post<ArrayBuffer>(`${serverURL}register`, userData, {
      'responseType': 'arraybuffer',
      headers:{'Content-Type': 'application/octet-stream'}
    });

    //Parse the reponse
    const responseData = response.data; 

    //Testing if we got the correct response
    // console.log('Response data', responseData);
    console.log(response.status);

    // //userID [0:8], authToken[8:40]
    const userIdBytes = Buffer.from(responseData.slice(0, 8));
    const authTokenBytes = Buffer.from(responseData.slice(8, 40));
    setAuthToken(authTokenBytes);
    //read as little endian and need to convert to string because electron-store json does not support bigint
    setUserId(userIdBytes.readBigInt64LE(0).toString());


  } catch (error) {
    console.error("Error registering account: ", error);
    return false;
  }

  return true;
  }


  export async function loginAccount(username : string, password : string): Promise<boolean> {
    //hash the passwords
    const hashServerPassword: Buffer = hash512_256(password);
    const hashKeyPassword: Buffer = hash256(password);

    //Ensure username is max 32 bytes
    const usernameBuffer = Buffer.from(username).slice(0,32);

    //Store username[0:32], passwordHash[32:64] to send to server
    const userData = Buffer.alloc(64,20);
    usernameBuffer.copy(userData, 0);
    hashServerPassword.copy(userData, 32);

    //testing output
    console.log('LOG IN USER DATA', userData.toString('utf8'));
    console.log('LOG IN USER DATA RAW', userData);
    console.log('LOG IN USER DATA LENGTH', userData.length);

    
    //Sending in raw data via API request to /login
    try {
      const serverURL = getServerURL();
      const response = await axios.post<ArrayBuffer>(`${serverURL}login`, userData, {
        'responseType': 'arraybuffer',
        headers:{'Content-Type': 'application/octet-stream'}
      });

      // Parse and store the userID, authToken, decrypt encrypted private keys
      const responseData = response.data; 

      //More testing
      console.log(response.status);

      //userID [0:8], authToken[8:40], privateKey1[40:72], privateKey2[72:104]
      const userIdBytes = Buffer.from(responseData.slice(0, 8));
      const authTokenBytes = Buffer.from(responseData.slice(8, 40));
      const encrPrivateKey1 = Buffer.from(responseData.slice(40,72));
      const encrPrivateKey2 = Buffer.from(responseData.slice(72,104));

      setAuthToken(authTokenBytes);
      //read as little endian and need to convert to string because electron-store json does not support bigint
      setUserId(userIdBytes.readBigInt64LE(0).toString());
      // Decrypt private keys and store them
      setPrivateKey1(decrypt(encrPrivateKey1, hashKeyPassword, hashKeyPassword));
      setPrivateKey2(decrypt(encrPrivateKey2, hashKeyPassword, hashKeyPassword));

    } catch (error){
      console.error("Error logging into account: ", error);
      return false;
    }


    return true;
  }
