import { useEffect, useState } from "react";

import { ProjectContentLines } from "../../../../shared/project";
import { useProject } from "../../../contexts/ProjectContext";

export function useDashboard() {
  const { connected, projectPath } = useProject();

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

    void loadProjectContent();
  }, [connected, projectPath]);

  return {
    connected,
    loading,
    projectContent,
    error,
  };
}
