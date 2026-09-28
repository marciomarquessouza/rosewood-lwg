import type { Rosewood } from "./shared/electron-api";

declare global {
  interface Window {
    rosewood: Rosewood;
  }
}

export {};
