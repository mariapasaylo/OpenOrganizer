/*
 * Authors: Kevin Sirantoine, Rachel Patella, Maria Pasaylo
 * Created: 2025-09-10
 * Updated: 2025-09-25
 *
 * This file declares sqliteAPI and electronStoreAPI for the renderer.
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
export {};

declare global {
  interface Window {
    sqliteAPI: {
      sqliteRead: (key: string) => Promise<string>;
      sqliteCreate: (key: string, value: string) => Promise<boolean>;
      sqliteUpdate: (key: string, value: string) => Promise<boolean>;
      sqliteDelete: (key: string) => Promise<boolean>;
    };

    electronStoreAPI: {
      getStoreName: () => Promise<string>;
      setStoreName: (name: string) => Promise<boolean>;
    }

    electronAuthAPI: {
      storeUserCredentials: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    }
  }
}
