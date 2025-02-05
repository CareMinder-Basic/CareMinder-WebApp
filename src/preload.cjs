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

contextBridge.exposeInMainWorld("tokenAPI", {
  getTokens: async () => await ipcRenderer.invoke("get-tokens"),
  getTokensAdmin: async () => await ipcRenderer.invoke("get-tokens-admin"),
});

contextBridge.exposeInMainWorld("authAPI", {
  loginSuccessWard: tokens => ipcRenderer.send("login-success-ward", tokens),

  loginSuccessAdmin: tokens => ipcRenderer.send("login-success-admin", tokens),

  // 유저 정보 반환
  getUserInfo: async () => await ipcRenderer.invoke("get-user-info"),

  // 병동 로그아웃
  logoutWard: () => ipcRenderer.send("logout-ward"),

  // 어드민 로그아웃
  logoutAdmin: () => ipcRenderer.send("logout-admin"),

  // 토큰 검증
  validateToken: async () => await ipcRenderer.invoke("validate-token"),

  // 토큰 갱신
  refreshToken: async () => await ipcRenderer.invoke("refresh-token"),
});
