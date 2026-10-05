import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ProjectContentLines } from "../../shared/project";
import { useProjectInfo } from "./ProjectInfoContext";
import { ProjectContent, ProjectOptions } from "../../schemas/project";

interface ProjectContentContextValue {
  loading: boolean;
  projectContent: ProjectContentLines | null;
  loadProjectContent: () => Promise<void>;
  findProjectLine: (options: ProjectOptions) => ProjectContent | undefined;
  error: string | null;
}

const ProjectContentContext = createContext<ProjectContentContextValue | null>(
  null,
);

interface ProjectContentProviderProps {
  children: ReactNode;
}

export function ProjectContentProvider({
  children,
}: ProjectContentProviderProps) {
  const { connected, projectPath } = useProjectInfo();

  const [loading, setLoading] = useState(false);
  const [projectContent, setProjectContent] =
    useState<ProjectContentLines | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !projectPath) {
      setProjectContent(null);
      setError(null);
      return;
    }

    void loadProjectContent();
  }, [connected, projectPath]);

  const loadProjectContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const content = await window.rosewood.getProjectContent(projectPath);

      setProjectContent(content);
    } catch (error) {
      setProjectContent(null);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to open project content.",
      );
    } finally {
      setLoading(false);
    }
  };

  const findProjectLine = ({ language, level }: ProjectOptions) =>
    projectContent?.lines.find(
      (line) => line.language === language && line.level === level,
    );

  return (
    <ProjectContentContext.Provider
      value={{
        loading,
        projectContent,
        loadProjectContent,
        findProjectLine,
        error,
      }}
    >
      {children}
    </ProjectContentContext.Provider>
  );
}

export function useProjectContent() {
  const context = useContext(ProjectContentContext);

  if (!context) {
    throw new Error(
      "useProjectContent must be used within a ProjectContentProvider.",
    );
  }

  return context;
}
