import { contextBridge, ipcRenderer } from "electron";
import type { Rosewood } from "../shared/electron-api";

const api: Rosewood = {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  selectProjectDirectory: () => ipcRenderer.invoke("app:select-directory"),
  openProject: (path) => ipcRenderer.invoke("project:open", path),
  getProjectContent: (path) => ipcRenderer.invoke("project:get-content", path),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (updates) => ipcRenderer.invoke("settings:update", updates),
};

contextBridge.exposeInMainWorld("rosewood", api);
