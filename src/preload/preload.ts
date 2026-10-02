import { contextBridge, ipcRenderer } from "electron";
import type { Rosewood } from "../shared/electron-api";

const api: Rosewood = {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  selectProjectDirectory: () => ipcRenderer.invoke("app:select-directory"),
  openProject: (path) => ipcRenderer.invoke("project:open", path),
  getProjectContent: (path) => ipcRenderer.invoke("project:get-content", path),
  saveProjectContent: (path, content) =>
    ipcRenderer.invoke("project:save-content", path, content),
  deleteProjectContent: (path, language, level) =>
    ipcRenderer.invoke("project:delete-content", path, language, level),
  pullProjectContent: (path) =>
    ipcRenderer.invoke("project:pull-content", path),
  pushProjectContent: (path) =>
    ipcRenderer.invoke("project:push-content", path),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (updates) => ipcRenderer.invoke("settings:update", updates),
};

contextBridge.exposeInMainWorld("rosewood", api);
