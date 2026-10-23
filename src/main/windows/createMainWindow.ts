import { BrowserWindow } from "electron";
import path from "node:path";

export function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    icon: path.join(__dirname, "../../assets/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

    if (process.env.ROSEWOOD_DEVTOOLS === "true") {
      mainWindow.webContents.openDevTools({
        mode: "detach",
      });
    }
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  return mainWindow;
}
