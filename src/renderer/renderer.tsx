import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ProjectInfo } from "../shared/project";

function App() {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectProject = async () => {
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
    <main>
      <h1>Rosewood</h1>
      <p>Content Manager for Learning With Ghosts</p>
      <button onClick={selectProject}>Open LWG Project</button>

      {project && (
        <>
          <p>Project: {project.path}</p>
          <p>Content: {project.contentPath}</p>
        </>
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
