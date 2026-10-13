import { contextBridge, ipcRenderer } from "electron";
import type { Rosewood } from "../shared/electron-api";

const api: Rosewood = {
  // app
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  selectProjectDirectory: () => ipcRenderer.invoke("app:select-directory"),

  // project
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

  // days
  getDaysContent: (path, options) =>
    ipcRenderer.invoke("days:get-content", path, options),
  createDayContent: (path, options, content) =>
    ipcRenderer.invoke("days:create-content", path, options, content),
  updateDayContent: (path, options, content) =>
    ipcRenderer.invoke("days:update-content", path, options, content),
  deleteDayContent: (path, options, dayDirectory) =>
    ipcRenderer.invoke("days:delete-content", path, options, dayDirectory),

  // lesson
  updateLessonContent: (path, options, lessonBase) =>
    ipcRenderer.invoke("lesson:update", path, options, lessonBase),

  // locales
  updateLocaleContent: (path, options, content) =>
    ipcRenderer.invoke("locales:update", path, options, content),

  // settings
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (updates) => ipcRenderer.invoke("settings:update", updates),
};

contextBridge.exposeInMainWorld("rosewood", api);
