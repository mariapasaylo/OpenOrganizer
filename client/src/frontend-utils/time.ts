/*
 * Authors: Rachel Patella
 * Created: 2025-10-23
 * Updated: 2025-10-23
 *
 * This file contains helper functions to handle time and date conversions on the client
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import {
  parseDate,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar';

// Helper function to convert inputted date YYYY-MM-DD and time HH:MM strings into a qcalendar TimeStamp to store in DB
export function ConvertTimeAndDateToTimestamp(dateString: string, timeString: string): Timestamp {
  const date = dateString.trim();
  const time = timeString.trim();
  // Pad seconds :00 onto time field since only HH:MM is provided
  const formatTime = time === '' ? '00:00:00' : (time.length === 5 ? `${time}:00` : time);
  // Combine date and time parts
  const dateTime = new Date(`${date}T${formatTime}`);
  // console.log('Combined DateTime:', dateTime);
  // Parse date object into a qcalendar timestamp. Timestamp has year, month, day, hour, minute, second, etc.
  const timeStamp = parseDate(dateTime);
  // console.log('Converted Timestamp:', timeStamp);
  // Return object that has all timestamp fields plus original date for UI rendering
  return {
  ...timeStamp,
  date: dateString
  } as Timestamp;
}



