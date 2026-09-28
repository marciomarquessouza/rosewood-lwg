import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

function App() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.rosewood.getAppVersion().then(setVersion);
  }, []);

  return (
    <main>
      <h1>Rosewood</h1>
      <p>Content Manager for Learning With Ghosts</p>
      <p>Version: {version}</p>
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
