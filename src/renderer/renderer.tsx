import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ProjectContent, ProjectInfo } from "../shared/project";

function App() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>();
  const [projectContent, setProjectContent] = useState<ProjectContent | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadProject = async () => {
    const settings =
      await window.rosewood.getSettings();

    if (!settings.projectPath) {
      return;
    }

    try {
      const project =
        await window.rosewood.openProject(
          settings.projectPath,
        );

      setProjectInfo(project);
    } catch {
      await window.rosewood.updateSettings({
        projectPath: null,
      });
    }
  };

  void loadProject();
}, []);

  const selectProject = async () => {
    setError(null);

    const path = await window.rosewood.selectProjectDirectory();

    if (!path) {
      return;
    }

    try {
      const project = await window.rosewood.openProject(path);

      await window.rosewood.updateSettings({
        projectPath: project.path,
      });

      setProjectInfo(project);
      const projectContent = await window.rosewood.getProjectContent(path);

      setProjectContent(projectContent);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to open project.",
      );
    }
  };

  return (
    <main>
      <h1>Rosewood</h1>
      <p>Content Manager for Learning With Ghosts</p>
      <button onClick={selectProject}>Open LWG Project</button>

      {projectContent && (
        <>
          {projectContent.lessonLanguages.map((lesson) => (
            <div key={lesson.language}>
              <h2>{lesson.language}</h2>
              {lesson.levels.map((level) => (
                <p>{level}</p>
              ))}
            </div>
          ))}
        </>
      )}

      {projectInfo && (
        <div>
          <p>{projectInfo.path}</p>
          <p>{projectInfo.contentPath}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </main>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
