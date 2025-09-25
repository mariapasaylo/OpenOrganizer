import {ipcMain} from "electron";
import {create, deleteEntry, read, update} from "app/src-electron/db/sqlite-db";
import {store} from "app/src-electron/services/store";

export function registerHandlers()
{
  // SQLite Handlers
  ipcMain.handle('sqliteRead', (event, key: string) => {
    return read(key);
  });

  ipcMain.handle('sqliteCreate', (event, key: string, value: string) => {
    create(key, value);
    return true;
  });

  ipcMain.handle('sqliteUpdate', (event, key: string, value: string) => {
    update(key, value);
    return true;
  });

  ipcMain.handle('sqliteDelete', (event, key: string) => {
    deleteEntry(key);
    return true;
  });

  // electron-store Handlers
  ipcMain.handle('getStoreName', () => {
    return store.get('name');
  });

  ipcMain.handle('setStoreName', (event, name: string) => {
    store.set('name', name);
    return true;
  });
}
