/*
 * Authors: Michael Jagiello
 * Created: 2025-09-27
 * Updated: 2025-09-27
 *
 * This file defines functions for AES256 encryption.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import crypto from 'crypto';

export function encrypt32(data: string, key: string) {
  if (data.length != 32 || key.length != 32) return null;
  const cipher = crypto.createCipheriv('aes-256-gcm', key, key);
  const encr = Buffer.from(cipher.update(data));
  return encr;
}

export function decrypt32(data: Buffer, key: string) {
  if (data.length != 32 || key.length != 32) return null;
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, key)
  const decr = Buffer.from(decipher.update(data));
  return decr;
}