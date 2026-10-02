import { deleteProjectContent } from "./deleteProjectContent";
import { getProjectContent } from "./getProjectContent";
import { openProject } from "./openProject";
import { pullProjectContent } from "./pullProjectContent";
import { pushProjectContent } from "./pushProjectContent";
import { saveProjectContent } from "./saveProjectContent";

export const projectServices = {
  openProject,
  getProjectContent,
  saveProjectContent,
  deleteProjectContent,
  pullProjectContent,
  pushProjectContent,
};
