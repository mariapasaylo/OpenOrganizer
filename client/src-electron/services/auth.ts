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
import bcrypt from 'bcrypt';

// import electron-store blueprint
interface Account {
    username : string;
    hashedPassword : string;
    authToken : Buffer;
    privateKey : Buffer;
    isLoggedIn : boolean;
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
    },
    isLoggedIn: {
        type: 'boolean',
        default: false
    }
};

// create store instance for account data
const accountStore = new Store<Account>({ 
    schema: accountSchema,
    name: 'account' 
});


async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
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

export function getIsLoggedIn(): boolean {
  return accountStore.get('isLoggedIn', false);
}

export function setIsLoggedIn(loggedIn: boolean) {
  accountStore.set('isLoggedIn', loggedIn);
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

    const hashedPassword = await hashPassword(password);
    setUsername(username);
    setHashedPassword(hashedPassword);
    
    return { success: true, message: 'Credentials stored successfully' };
  } catch (error) {
    console.error('Error storing credentials:', error);
    return { success: false, message: 'Failed to store credentials' };
  }
}

export async function verifyUserCredentials(username: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    const storedUsername = getUsername();
    const storedHashedPassword = getHashedPassword();

    if (!storedUsername || !storedHashedPassword) {
      return { success: false, message: 'No user account found. Please register first.' };
    }

    if (storedUsername !== username) {
      return { success: false, message: 'Invalid username' };
    }

    const isPasswordValid = await validatePassword(password, storedHashedPassword);
    
    if (isPasswordValid) {
      setIsLoggedIn(true);
      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: 'Invalid password' };
    }
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return { success: false, message: 'Login verification failed' };
  }
}

// Function to logout user
export function logoutUser(): void {
  setIsLoggedIn(false);
}

// Function to check if user is currently logged in
export function checkLoginStatus(): boolean {
  return getIsLoggedIn();
}
