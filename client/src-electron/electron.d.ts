export {};

declare global {
  interface Window {
    electronAPI: {
      sqliteLoad: (key: string) => Promise<string>;
      sqliteStore: (key: string, value: string) => Promise<boolean>;
    };
  }
}
