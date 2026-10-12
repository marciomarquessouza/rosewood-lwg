import { app, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";

import { createSplashWindow } from "./windows/createSplashWindow";
import { createMainWindow } from "./windows/createMainWindow";
import { registerIpcHandlers } from "./ipc";

if (started) {
  app.quit();
}

const createWindow = () => {
  const splashWindow = createSplashWindow();
  const mainWindow = createMainWindow();

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      mainWindow.maximize();
      mainWindow.show();
      splashWindow.close();
    }, 3000);
  });
};

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
