/*
 * Authors: Michael Jagiello
 * Created: 2025-09-27
 * Updated: 2025-09-27
 *
 * This file defines wrapper functions for AES256 encryption/decryption, as well as a padding helper function that sets a string to 32 characters.
 * It also contains wrapper functions for SHA hashing algorithms 256, 512/256, and 512.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import crypto from 'crypto';

// pads a string and limits it to 32 characters
export function pad32(str: string): string {
  const nullString = '\0'.repeat(32);
  return str.concat(nullString).substring(0, 32);
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