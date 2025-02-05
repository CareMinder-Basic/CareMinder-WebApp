import { config } from "dotenv";
import { app, BrowserWindow, ipcMain, screen, session, protocol, dialog } from "electron";
import { join } from "path";
import { fileURLToPath, format } from "url";
import Store from "electron-store";
import path from "path";
import AutoLaunch from "auto-launch";

const autoLauncher = new AutoLaunch({
  name: "CareMinder", // 애플리케이션 이름
  path: app.getPath("exe"), // 애플리케이션 경로
});

const __filename = fileURLToPath(import.meta.url); // 현재 파일의 경로
const __dirname = path.dirname(__filename); // 현재 디렉토리 경로

config({ path: join(__dirname, "../.env") });
const isDev = process.env.VITE_IS_DEV === "true";
const store = new Store();

let win; // 전역 변수로 선언

// 자동 실행 활성화 함수
const enableAutoLaunch = async () => {
  try {
    const isEnabled = await autoLauncher.isEnabled();
    if (!isEnabled) {
      await autoLauncher.enable(); // 자동 실행 활성화
      console.log("자동 실행 활성화 완료");
    }
  } catch (err) {
    console.error("자동 실행 활성화 실패:", err);
  }
};

// 앱이 백그라운드 상태인지 확인하는 함수 수정
function isAppInBackground() {
  const windows = BrowserWindow.getAllWindows();
  return windows.every(win => {
    return win.isMinimized() || !win.isFocused() || !win.isVisible();
  });
}

// 자동 실행 비활성화 함수
const disableAutoLaunch = async () => {
  try {
    await autoLauncher.disable();
    console.log("자동 실행 비활성화 완료");
  } catch (err) {
    console.error("자동 실행 비활성화 실패:", err);
  }
};

let updateLoadingWindow = null;

function createUpdateLoadingWindow() {
  updateLoadingWindow = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  updateLoadingWindow.loadFile(path.join(__dirname, "update-loading.html"));
}

function createSplashWindow() {
  const splashWindow = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      allowRunningInsecureContent: true,
      nodeIntegration: true,
    },
  });
  splashWindow.loadFile(path.join(__dirname, "loading.html"));
  return splashWindow;
}
const startUrl = format({
  pathname: path.resolve(__dirname, "../dist/index.html"),
  protocol: "file:",
  slashes: true,
});

async function createWindow() {
  const splashWindow = createSplashWindow();
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
      preload: path.resolve(__dirname, "preload.cjs"),
    },
  });

  const accessTokenWard = store.get("accessTokenWard");
  const refreshTokenWard = store.get("refreshTokenWard");
  const accessTokenAdmin = store.get("accessTokenAdmin");
  const refreshTokenAdmin = store.get("refreshTokenAdmin");
  const userType = store.get("userType");

  console.log(userType.type, accessTokenAdmin, refreshTokenAdmin);

  if (
    (userType.type === "WARD" && accessTokenWard && refreshTokenWard) ||
    (userType.type === "ADMIN" && accessTokenAdmin && refreshTokenAdmin)
  ) {
    win.loadFile(path.join(__dirname, "webview.html"));
  } else {
    win.loadURL(startUrl);
  }

  /** 시작 포인트 실행 */

  win.webContents.on("did-finish-load", () => {
    console.log("Main window has finished loading.");
    // userType을 renderer로 전달
    const userType = store.get("userType");

    if (userType) {
      win.webContents.send("init-user-type", userType);
    }

    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy();
      win.show();
    }
  });
}

let message = "";
function displayNotificationBackground(notification) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const notificationWidth = 302;
  const notificationHeight = 118;
  const x = width - notificationWidth - 10;
  const y = height - notificationHeight - 10;
  let notificationWindow = new BrowserWindow({
    width: notificationWidth,
    height: notificationHeight,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: "#00000000", // 완전 투명 배경 추가
    hasShadow: false, // 그림자 제거
    x: x,
    y: y,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  notificationWindow.loadURL(path.join("file:", __dirname, "notification.html"));

  const content = JSON.parse(notification.data);
  message = content.content;
  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification);
  });

  setTimeout(() => {
    notificationWindow.close();
    notificationWindow = null;
  }, 5500);
}

function displayNotificationForground(notification) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const notificationWidth = 302;
  const notificationHeight = 118;
  const x = width - notificationWidth - 10;
  const y = 10;
  let notificationWindow = new BrowserWindow({
    width: notificationWidth,
    height: notificationHeight,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    x: x, // x 좌표 설정
    y: y, // y 좌표 설정
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  notificationWindow.loadURL(path.join("file:", __dirname, "notification.html"));
  const content = JSON.parse(notification.data);
  message = content.content;

  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification);
  });

  setTimeout(() => {
    notificationWindow.close();
    notificationWindow = null;
  }, 5500);
}

app.whenReady().then(async () => {
  createWindow();
  enableAutoLaunch();

  ipcMain.handle("get-fcm", (event, key) => {
    const value = store.get("fcm_token"); // 데이터 읽기
    console.log(`Data retrieved: ${key} = ${value}`);
    return value;
  });

  ipcMain.handle("store:set", async (event, key, value) => {
    store.set(key, value);
    console.log(key, store.get(key));
    return true;
  });
  ipcMain.handle("store:get", (event, key) => {
    return store.get(key);
  });

  ipcMain.handle("store:delete", (event, key) => {
    store.delete(key);
    return true;
  });
  ipcMain.handle("get-tokens", () => {
    const accessToken = store.get("accessTokenWard");
    const refreshToken = store.get("refreshTokenWard");
    return { accessToken, refreshToken };
  });
  ipcMain.handle("get-tokens-admin", () => {
    const accessToken = store.get("accessTokenAdmin");
    const refreshToken = store.get("refreshTokenAdmin");
    return { accessToken, refreshToken };
  });
  ipcMain.handle("get-notification", async event => {
    console.log("📩 Electron이 알림을 반환합니다:", message);
    return message; // Renderer에게 전달
  });

  ipcMain.on("login-success-ward", (event, tokens) => {
    store.set("accessTokenWard", tokens.accessToken);
    store.set("refreshTokenWard", tokens.refreshToken);
    win.loadFile(path.join(__dirname, "webview.html"));
  });
  ipcMain.on("login-success-admin", (event, tokens) => {
    store.set("accessTokenAdmin", tokens.accessToken);
    store.set("refreshTokenAdmin", tokens.refreshToken);
    win.loadFile(path.join(__dirname, "webview.html"));
  });

  ipcMain.handle("get-user-info", () => {
    const userInfo = store.get("userType");
    return userInfo;
  });

  ipcMain.on("logout-ward", () => {
    store.delete("accessTokenWard");
    store.delete("refreshTokenWard");
    win.loadURL(startUrl);
  });

  ipcMain.on("logout-admin", () => {
    store.delete("accessTokenAdmin");
    store.delete("refreshTokenAdmin");
    win.loadURL(startUrl);
  });

  ipcMain.on("sse-message", (event, message) => {
    console.log("📩 Electron이 SSE 메시지를 받음. 백그라운드 상태:", isAppInBackground());
    if (isAppInBackground()) {
      console.log(message);
      displayNotificationBackground(message);
    } else {
      console.log(message);
      displayNotificationForground(message);
    }
  });
});

// window-all-closed 이벤트 핸들러 수정
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// before-quit 이벤트 수정
app.on("before-quit", event => {
  event.preventDefault();
  app.exit(0);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
