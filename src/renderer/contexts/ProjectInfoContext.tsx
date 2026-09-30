import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProjectInfo } from "../../shared/project";

interface ProjectInfoContextValue {
  connected: boolean;
  loading: boolean;
  projectPath: string;
  contentPath: string;
  error: string | null;
  connect?: () => Promise<void>;
}

const ProjectInfoContext = createContext<ProjectInfoContextValue | undefined>(
  undefined,
);

export const ProjectInfoProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentPath = project?.contentPath
    ? project?.contentPath.replace(project?.path, "")
    : "";

  useEffect(() => {
    const loadProject = async () => {
      try {
        const settings = await window.rosewood.getSettings();

        if (!settings.projectPath) {
          setProject(null);
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
    <ProjectInfoContext.Provider
      value={{
        connected: !!project,
        loading,
        projectPath: project?.path ?? "",
        contentPath,
        connect: connectProject,
        error,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
};

export const useProjectInfo = () => {
  const context = useContext(ProjectInfoContext);

  if (!context) {
    throw new Error("useProjectInfo must be used within ProjectProvider");
  }

  return context;
};
