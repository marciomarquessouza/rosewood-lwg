import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProjectInfo } from "../../shared/project";

interface ProjectContextValue {
  connected: boolean;
  projectPath: string | null;
  contentPath: string | null;
  error: string | null;
  connect?: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue>({
  connected: false,
  projectPath: null,
  contentPath: null,
  error: null,
});

export const ProjectProvider = ({ children }: PropsWithChildren) => {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      const settings = await window.rosewood.getSettings();

      if (!settings.projectPath) {
        return;
      }

      try {
        const project = await window.rosewood.openProject(settings.projectPath);

        setProject(project);
      } catch {
        await window.rosewood.updateSettings({
          projectPath: null,
        });
      }
    };

    void loadProject();
  }, []);

  const connectProject = async () => {
    setError(null);

    const path = await window.rosewood.selectProjectDirectory();

    if (!path) {
      return;
    }

    try {
      const project = await window.rosewood.openProject(path);

      setProject(project);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to open project.",
      );
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        connected: !!project?.path,
        projectPath: project?.path ?? null,
        contentPath: project?.contentPath ?? null,
        connect: connectProject,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  return useContext(ProjectContext);
};
