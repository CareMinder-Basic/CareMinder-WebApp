import { config } from "dotenv";
import { app, BrowserWindow, ipcMain, screen, session, protocol, dialog } from "electron";
import { join } from "path";
import { fileURLToPath, format } from "url";
import Store from "electron-store";
import path from "path";
import sound from "sound-play";
import AutoLaunch from "auto-launch";
import updater from "electron-updater";
import log from "electron-log";

const autoLauncher = new AutoLaunch({
  name: "CareMinder", // 애플리케이션 이름
  path: app.getPath("exe"), // 애플리케이션 경로
});

// const __dirname = dirname(fileURLToPath(import.meta.url));
const { autoUpdater } = updater;
autoUpdater.forceDevUpdateConfig = true;
log.transports.file.resolvePath = () => path.join(app.getPath("userData"), "logs/main.log");
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
const __filename = fileURLToPath(import.meta.url); // 현재 파일의 경로
const __dirname = path.dirname(__filename); // 현재 디렉토리 경로

config({ path: join(__dirname, "../.env") });
const isDev = process.env.VITE_IS_DEV === "true";
const store = new Store();

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

async function createWindow() {
  const splashWindow = createSplashWindow();
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
      // preload: path.join("file:", __dirname, "preload.mjs"),
      preload: path.resolve(__dirname, "preload.cjs"),
    },
  });

  console.log("HTML File Path:", path.resolve(__dirname, "../dist/index.html"));

  // win.loadURL("http://localhost:5173");
  const startUrl = format({
    pathname: path.resolve(__dirname, "../dist/index.html"),
    protocol: "file:",
    slashes: true,
  });

  console.log(store.get("userType"));

  /** 시작 포인트 실행 */
  win.loadURL(startUrl);

  // win.loadFile(filePath);

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

  win.on("minimize", () => {
    console.log("Window minimized");
  });

  win.on("focus", () => {
    console.log("Window focused");
  });

  win.on("blur", () => {
    console.log("Window lost focus");
  });
}

let persistentIds = [];

function onNotification({ notification, persistentId }) {
  console.log("Notification received:", notification, persistentId);
  const newPersistentId = notification.data.data;
  if (persistentIds.includes(newPersistentId)) {
    return; // 중복 알림
  }
  persistentIds.push(newPersistentId);
  displayNotificationBackground(notification);
}

let message = "";
function displayNotificationBackground(notification) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  sound.play(path.join(__dirname, "alarm.wav"));
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

  message = notification.content;
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
  sound.play(path.join(__dirname, "alarm.wav"));
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
  message = notification.content;

  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification.data.data);
  });

  setTimeout(() => {
    notificationWindow.close();
    notificationWindow = null;
  }, 5500);
}

let isUpdateInProgress = true;
autoUpdater.on("checking-for-update", () => {
  log.info("업데이트 확인 중...");
});
autoUpdater.on("update-available", info => {
  log.info("업데이트가 가능합니다.");
});
autoUpdater.on("update-not-available", info => {
  log.info("현재 최신버전입니다.");
  const splashWindow = createSplashWindow();
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.destroy();
    createWindow();
  }
});
autoUpdater.on("error", err => {
  log.info("에러가 발생하였습니다. 에러내용 : " + err);
  const splashWindow = createSplashWindow();
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.destroy();
    createWindow();
  }
});
autoUpdater.on("download-progress", progressObj => {
  const splashWindow = createSplashWindow();
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.destroy();
    createUpdateLoadingWindow();
  }
  let log_message = "다운로드 속도: " + progressObj.bytesPerSecond;
  log_message = log_message + " - 현재 " + progressObj.percent + "%";
  log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  log.info(log_message);
  if (updateLoadingWindow) {
    updateLoadingWindow.webContents.send("update-progress", progressObj.percent);
  }
});
autoUpdater.on("update-downloaded", () => {
  log.info("업데이트가 완료되었습니다.");
  if (updateLoadingWindow) {
    updateLoadingWindow.close();
    updateLoadingWindow = null;
  }

  log.info("업데이트 설치를 시작합니다.");

  // 모든 창을 닫고 업데이트 설치 시작
  BrowserWindow.getAllWindows().forEach(window => window.close());
  isUpdateInProgress = false;
  autoUpdater.quitAndInstall(); // 업데이트 설치 후 앱 종료 및 재시작
});

app.whenReady().then(async () => {
  // autoUpdater.checkForUpdates();
  // if (!isUpdateInProgress) {
  createWindow();
  enableAutoLaunch();
  // }

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
  ipcMain.handle("get-notification", async event => {
    console.log("📩 Electron이 알림을 반환합니다:", message);
    return message; // Renderer에게 전달
  });

  ipcMain.on("sse-message", (event, message) => {
    console.log("📩 Electron이 SSE 메시지를 받음. 백그라운드 상태:", isAppInBackground());

    if (isAppInBackground()) {
      console.log("백그라운드 알림 표시");
      displayNotificationBackground(message);
    } else {
      console.log("포그라운드 알림 표시");
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
