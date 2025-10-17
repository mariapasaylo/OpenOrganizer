/*
 * Authors: Kevin Sirantoine, Maria Pasaylo
 * Created: 2025-10-07
 * Updated: 2025-10-17
 *
 * This file contains functions related to user authentication including getters and setters for privateKey, username, password, and authToken.
 * This file will eventually contain login and account creation functions.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import {generatePrivateKey} from "app/src-electron/services/crypto";
import Store from 'electron-store';
import type { Schema } from 'electron-store';
import { createHash } from 'crypto';

// import electron-store blueprint
interface Account {
    username : string;
    hashedPassword : string;
    authToken : Buffer;
    privateKey : Buffer;
}

// Define schema for the account store
const accountSchema: Schema<Account> = {
    username: { 
        type: 'string', 
        default: 'NewUser' 
    },
    hashedPassword: { 
        type: 'string', 
        default: '' 
    },
    authToken: { 
        type: 'object', 
        default: Buffer.alloc(32) 
    },
    privateKey: { 
        type: 'object', 
        default: generatePrivateKey()
    }
};

// create store instance for account data
const accountStore = new Store<Account>({ 
    schema: accountSchema,
    name: 'account' 
});



// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function getUsername() {
  return accountStore.get('username');
}

export function setUsername(username : string) {
  accountStore.set('username', username);
}

export function getHashedPassword() {
  return accountStore.get('hashedPassword');
}

export function setHashedPassword(hashedPassword : string) {
  accountStore.set('hashedPassword', hashedPassword);
}

export function getAuthToken() {
  return accountStore.get('authToken');
}

export function setAuthToken(authToken : Buffer) {
  accountStore.set('authToken', authToken);
}

export function getPrivateKey() {
  return accountStore.get('privateKey');
}

export function setPrivateKey(privateKey : Buffer) {
  accountStore.set('privateKey', privateKey);
}

export async function storeUserCredentials(username: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    const hashedPassword = hashPassword(password);
    setUsername(username);
    setHashedPassword(hashedPassword);
    
    return { success: true, message: 'Credentials stored successfully' };
  } catch (error) {
    console.error('Error storing credentials:', error);
    return { success: false, message: 'Failed to store credentials' };
  }
}


export function createAccount(username : string, password : string) {
  // hash password, generate and store privateKey, encrypt privateKey with SHA256(password)
  // send API request to /register
}
