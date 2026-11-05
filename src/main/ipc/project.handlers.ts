import { ipcMain } from "electron";
import { projectServices } from "../services/project";
import { ProjectContent } from "../../schemas/project";
import { Language } from "../../schemas/language";
import { saveCharacter } from "../services/characters";
import type { CharacterProfile } from "../../schemas/characterProfile";
import { Level } from "../../schemas/level";

export function registerProjectHandlers() {
  ipcMain.handle("characters:save", async (_, projectPath: string, character: CharacterProfile, isUpdate: boolean) => {
    return saveCharacter(projectPath, character, isUpdate);
  });

  ipcMain.handle("project:open", async (_, projectPath: string) => {
    return projectServices.openProject(projectPath);
  });

  ipcMain.handle("project:get-content", async (_, projectPath: string) => {
    return projectServices.getProjectContent(projectPath);
  });

  ipcMain.handle(
    "project:save-content",
    async (_, targetPath: string, content: ProjectContent) => {
      return projectServices.saveProjectContent(targetPath, content);
    },
  );

  ipcMain.handle(
    "project:delete-content",
    async (_, targetPath: string, language: Language, level: Level) => {
      return projectServices.deleteProjectContent(targetPath, language, level);
    },
  );

  ipcMain.handle("project:pull-content", async (_, targetPath: string) => {
    return projectServices.pullProjectContent(targetPath);
  });

  ipcMain.handle(
    "project:generate-importers",
    async (_, targetPath: string) => {
      return projectServices.generateImporters(targetPath);
    },
  );

  ipcMain.handle("project:push-content", async (_, targetPath: string) => {
    return projectServices.pushProjectContent(targetPath);
  });
}
