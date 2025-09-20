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
 */
import Store from 'electron-store';
import type { Schema } from 'electron-store';


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