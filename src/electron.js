import { config } from "dotenv";
import { app, BrowserWindow, ipcMain, screen, session, protocol, dialog } from "electron";
import { join } from "path";
import { fileURLToPath, format } from "url";
import Store from "electron-store";
import { register, listen } from "push-receiver-v2";
import path from "path";
import sound from "sound-play";
import AutoLaunch from "auto-launch";
import updater from "electron-updater";
import log from "electron-log";

const autoLauncher = new AutoLaunch({
  name: "CareMinder", // 애플리케이션 이름
  path: app.getPath("exe"), // 애플리케이션 경로
});

const firebaseConfig = {
  firebase: {
    apiKey: "AIzaSyDr2aG0diglJe-A-lC9VqpfLnoEz1Baj4I",
    appID: "1:264563409584:web:228f2d074c73b057023175",
    projectID: "careminder-e50ae",
  },
  vapidKey:
    "BDOPhFvQMqh6P-qImnWLcs_eCrPP04JOZ3MYUS1aPhdrsxq1HrliVRIaIcC7mMr2Xcw7zYQyVvEtuTD8D3ux1pU", // optional
};

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

function isAppInBackground() {
  const windows = BrowserWindow.getAllWindows();
  return !windows.some(win => win.isFocused()); // 포커스된 창이 없으면 백그라운드
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
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  console.log("HTML File Path:", path.resolve(__dirname, "../dist/index.html"));

  const credentials = await register(firebaseConfig);
  console.log(credentials);

  const savedFcmToken = store.get("fcm_token");
  console.log("Retrieved FCM Token:", savedFcmToken);

  await listen({ ...credentials }, onNotification);

  // win.loadURL("http://localhost:5173");
  const startUrl = format({
    pathname: path.resolve(__dirname, "../dist/index.html"),
    protocol: "file:",
    slashes: true,
  });

  /** 시작 포인트 실행 */
  win.loadURL(startUrl);

  // win.loadFile(filePath);

  win.webContents.on("did-finish-load", () => {
    console.log("Main window has finished loading.");

    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy();
      win.show();
    }
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
  const y = height - notificationHeight + 10;
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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  notificationWindow.loadURL(path.join("file:", __dirname, "notification.html"));

  message = notification.data.data;

  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification.data.data);
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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  notificationWindow.loadURL(path.join("file:", __dirname, "notification.html"));

  message = notification.data.data;

  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification.data.data);
  });

  setTimeout(() => {
    notificationWindow.close();
    notificationWindow = null;
  }, 5500);
}

// 앱 종료 시 staff 토큰 삭제 함수
async function clearStaffTokens() {
  try {
    if (store) {
      // store 객체가 존재하는지 확인
      await store.delete("accessTokenStaff");
      await store.delete("refreshTokenStaff");
      console.log("Staff tokens cleared on app exit");
    }
  } catch (error) {
    console.error("Error clearing staff tokens:", error);
  }
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
  autoUpdater.checkForUpdates();
  if (!isUpdateInProgress) {
    createWindow();
    enableAutoLaunch();
  }

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
  ipcMain.handle("get-notification", (event, key) => {
    return message;
  });

  ipcMain.on("sse-message", (event, message) => {
    console.log("📩 Electron이 받은 SSE 메시지:", message);
    if (isAppInBackground()) {
      displayNotificationBackground({});
    } else {
      displayNotificationForground({});
    }
  });
});

// window-all-closed 이벤트 핸들러 수정
app.on("window-all-closed", () => {
  clearStaffTokens().then(() => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

// before-quit 이벤트 수정
app.on("before-quit", event => {
  event.preventDefault();
  clearStaffTokens()
    .then(() => {
      app.exit(0); // 정상 종료 코드 추가
    })
    .catch(error => {
      console.error("Error during app quit:", error);
      app.exit(1); // 에러 종료 코드
    });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
