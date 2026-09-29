import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { getProjectContent, openProject } from "./services/project-service";
import { getSettings, updateSettings } from "./services/settings-service";
import { AppSettings } from "../shared/settings";
import { createSplashWindow } from "./windows/createSplashWindow";
import { createMainWindow } from "./windows/createMainWindow";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

ipcMain.handle("app:select-directory", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0] ?? null;
});

ipcMain.handle("project:open", async (_, projectPath: string) => {
  return openProject(projectPath);
});

ipcMain.handle("project:get-content", async (_, projectPath: string) => {
  return getProjectContent(projectPath);
});

ipcMain.handle("settings:get", async () => {
  return getSettings();
});

ipcMain.handle("settings:update", async (_, updates: Partial<AppSettings>) => {
  return updateSettings(updates);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
