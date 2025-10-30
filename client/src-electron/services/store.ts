/**
 * Created on 9/17/2025 by Maria Pasaylo
 * Data persistence module using electron-store
 * This module manages user data storage that persists
 * between app sessions.
 * Data stored in config.json in user data directory
 * (e.g. C:\Users\<your username>\AppData\Roaming\Electron)
 * References:
 * https://github.com/sindresorhus/electron-store/tree/main
 *
 * Updated on 9/20/2025 by Maria Pasaylo - removed console logs for testing on terminal
 * Updated on 10/29/25 by Kevin Sirantoine
 */
import Store from 'electron-store';
import type { Schema } from 'electron-store';

// Define the blueprint for user data
interface LastUpdated {
  lastUpNotes: Buffer,
  lastUpReminders: Buffer,
  lastUpDaily: Buffer,
  lastUpWeekly: Buffer,
  lastUpMonthly: Buffer,
  lastUpYearly: Buffer,
  lastUpExtensions: Buffer,
  lastUpOverrides: Buffer,
  lastUpFolders: Buffer,
  lastUpDeleted: Buffer
}

// Define schema for the store to enforce data types and defaults
const lastUpdatedSchema: Schema<LastUpdated> = {
  lastUpNotes: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpReminders: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpDaily: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpWeekly: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpMonthly: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpYearly: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpExtensions: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpOverrides: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpFolders: {
    type: 'object',
    default: Buffer.alloc(8)
  },
  lastUpDeleted: {
    type: 'object',
    default: Buffer.alloc(8)
  }
};

export const lastUpdated = new Store<LastUpdated>({ schema: lastUpdatedSchema });


// Index Page Testing
// Define the blueprint for user data
interface User {
    name : string;
    systemTime : string;
}

// Define schema for the store to enforce data types and defaults
const schema: Schema<User> = {
    name: {
        type: 'string',
        default: 'Alberta Gator'
    },
    systemTime: {
        type: 'string',
        default: new Date().toISOString()
    },
};

export const store = new Store<User>({ schema });
