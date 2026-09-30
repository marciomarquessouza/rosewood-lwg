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
  loading: boolean;
  projectPath: string;
  contentPath: string;
  error: string | null;
  connect?: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const ProjectProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const settings = await window.rosewood.getSettings();

        if (!settings.projectPath) {
          return;
        }

        const project = await window.rosewood.openProject(settings.projectPath);

        setProject(project);
      } catch {
        setProject(null);

        await window.rosewood.updateSettings({
          projectPath: null,
        });
      } finally {
        setLoading(false);
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

    setLoading(true);

    try {
      const project = await window.rosewood.openProject(path);
      setProject(project);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to open project.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        connected: !!project,
        loading,
        projectPath: project?.path ?? "",
        contentPath: project?.contentPath ?? "",
        connect: connectProject,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }

  return context;
};
