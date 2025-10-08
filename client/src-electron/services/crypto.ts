/*
 * Authors: Michael Jagiello, Kevin Sirantoine
 * Created: 2025-09-27
 * Updated: 2025-10-07
 *
 * This file defines wrapper functions for AES256 encryption/decryption and key generation, as well as padding helper functions for getting data and keys to the proper length.
 * It also contains wrapper functions for SHA hashing algorithms 256, 512/256, and 512.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import crypto from 'crypto';

// pads a string / buffer and hard limits it to 32 characters
export function pad32(data: string | Buffer) {
  if (data.length % 32 == 0) {
    return data;
  }
  const nullString = '\0'.repeat(32 - (data.length % 32));
  const strPadded = (data.toString() + nullString).slice(0, 32);
  if (typeof data === 'string') {
    return strPadded;
  }
  return Buffer.from(strPadded);
}

// pads a key up to 32 and returns "" if key is longer than 32
export function padKey32(key: string | Buffer) {
  if (key.length > 32) {
    return "";
  }
  return pad32(key);
}

// pads data up to the next multiple of 32
export function padData32n(data: string | Buffer) {
  if (data.length % 32 == 0) {
    return data;
  }
  const nullString = '\0'.repeat(32 - (data.length % 32));
  const dataOut = data.toString() + nullString.toString();
  if (typeof data === 'string') {
    return dataOut;
  }
  return Buffer.from(dataOut);
}

// encrypt data string using AES256
// key must be 32 bytes long
export function encrypt(data: Buffer | string, key: Buffer | string, iv: Buffer | string) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  return Buffer.from(cipher.update(data));
}

// decrypt data string using AES256
// key must be 32 bytes long
export function decrypt(data: Buffer, key: Buffer | string, iv: Buffer | string) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  return Buffer.from(decipher.update(data));
}

// generate a private key for symmetric AES256
export function generatePrivateKey() {
  return crypto.randomBytes(32);
}

// hash using sha256, return 32-byte data buffer
export function hash256(data: Buffer | string) {
  return crypto.createHash('sha256').update(data).digest();
}

// hash using sha512_256, return 32-byte data buffer
export function hash512_256(data: Buffer | string) {
  return crypto.createHash('sha512-256').update(data).digest();
}

// hash using sha512, return 64-byte data buffer
export function hash512(data: Buffer | string) {
  return crypto.createHash('sha512').update(data).digest();
}
