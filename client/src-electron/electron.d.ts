/* Updated on 9/20/2025 by Maria Pasaylo - added electron-store handlers
**/
export {};

declare global {
  interface Window {
    electronAPI: {
      sqliteRead: (key: string) => Promise<string>;
      sqliteCreate: (key: string, value: string) => Promise<boolean>;
      sqliteUpdate: (key: string, value: string) => Promise<boolean>;
      sqliteDelete: (key: string) => Promise<boolean>;
      getStoreName: () => Promise<string>;
      setStoreName: (name: string) => Promise<boolean>;
    };
  }
}
