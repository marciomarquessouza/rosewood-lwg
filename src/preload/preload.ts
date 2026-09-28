import { contextBridge, ipcRenderer } from "electron";
import type { Rosewood } from "../shared/electron-api";

const api: Rosewood = {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  selectProjectDirectory: () => ipcRenderer.invoke("app:select-directory"),
  openProject: (path) => ipcRenderer.invoke("project:open", path),
};

contextBridge.exposeInMainWorld("rosewood", api);
