export interface ElectronStore {
  set: (key: string, value: any) => Promise<void>;
  get: (key: string) => Promise<any>;
  delete: (key: string) => Promise<void>;
}

export interface TokenAPI {
  getTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
}

declare global {
  interface Window {
    electronStore: ElectronStore;
    tokenAPI: TokenAPI;
    api: {
      getNotification: () => Promise<any>;
      send: (channel: string, data: any) => void;
      receive: (channel: string, callback: (...args: any[]) => void) => void;
      onInitUserType: (callback: (userType: string) => void) => void;
    };
  }
}
