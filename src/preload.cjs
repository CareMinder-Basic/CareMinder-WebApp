// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getNotification: async () => await ipcRenderer.invoke("get-notification"),
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  onInitUserType: callback =>
    ipcRenderer.on("init-user-type", (event, userType) => callback(userType)),
});

contextBridge.exposeInMainWorld("electronStore", {
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  get: key => ipcRenderer.invoke("store:get", key),
  delete: key => ipcRenderer.invoke("store:delete", key),
});

contextBridge.exposeInMainWorld("Fcm", {
  // getFcmData: key => ipcRenderer.invoke(key),
  getFcmData: async key => {
    try {
      const result = await ipcRenderer.invoke("get-fcm", key);
      console.log("접근");
      return result;
    } catch (error) {
      console.error("Error in getFcmData:", error);
      throw error;
    }
  },
});

contextBridge.exposeInMainWorld("tokenAPI", {
  getTokens: async () => await ipcRenderer.invoke("get-tokens"), // 토큰 가져오기
});
