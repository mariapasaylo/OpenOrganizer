
/*
 * Authors: Rachel Patella
 * Created: 2025-10-21
 * Updated: 2025-10-22
 *
 * This file contains interfaces that extend the shared-types with UI-specific fields.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */



import type { Note, Reminder, Folder} from '../../src-electron/types/shared-types'; 

// UI types extend client backend/shared-types model with UI-only fields for use in renderer
// Some fields can change in the UI (ex. folderID null until user selects a folder), but are set in stone for backend DB

// Shared-types note has itemID, lastModified, folderID, isExtended, title, text
export type UINote = Note & {
  temporaryTitle: string;
  temporaryText: string;
  temporaryFolderID: number | null; // The folder selected in the dropdown before the note is saved
   // This is needed to retain the folder state before the note is saved again
  // Ex. if user has a saved note and selects a folder but then cancels, it reverts back to the previous folderID
  titleMessageError?: string; // error message for title validation. Each note has this property so error message only shows up for the specific notes that have an error
  folderMessageError?: string;
  isSaved: boolean;
  expanded: boolean; // open or closed carat
  isSelected: boolean; // checkbox selection
  date: string; 
};

// Shared-types reminder has itemID, lastModified, folderID, EventType, isExtended, title, hasNotif, etc.
export type UIReminder = Reminder & {
  temporaryTitle: string;
  temporaryFolderID: number | null;
  temporaryNotificationTime: number | null; // Either minutes before event start or null for no notification
  titleMessageError?: string;
  folderMessageError?: string;
  timeMessageError?: string;
  extension: Record<string, string | number | null>;  // Essentially extension is a dictionary-like object with keys (ex. field names) and values  
  // useful for adding on custom event type fields/extensions that we may not know the types to yet
  // Need to parse and store this text data in the separate extensions table in the backend
  isSaved: boolean;
  expanded: boolean;
  isSelected: boolean;
// UI-only date field - calendar date selected for the reminder
  date: string;
};

// Shared-types folder has folderID, lastModified, parentFolderID, colorCode, folderName
export type UIFolder = Folder & {
  children?: UIFolder[];
};

