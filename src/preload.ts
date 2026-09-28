import { contextBridge, ipcRenderer } from "electron";

import type { Rosewood } from "./shared/electron-api";

const api: Rosewood = {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
};

contextBridge.exposeInMainWorld("rosewood", api);
