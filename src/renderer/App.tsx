import { ProjectContentProvider } from "./contexts/ProjectContentContext";
import { ProjectInfoProvider } from "./contexts/ProjectInfoContext";
import { Dashboard } from "./features/Dashboard";
import { ProjectForm } from "./features/Projects/ProjectForm";
import { AppLayout } from "./layouts/AppLayout";
import { HashRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <HashRouter>
      <ProjectInfoProvider>
        <ProjectContentProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/project/new" element={<ProjectForm />} />
              <Route
                path="/project/:language/:level"
                element={<ProjectForm />}
              />
            </Route>
          </Routes>
        </ProjectContentProvider>
      </ProjectInfoProvider>
    </HashRouter>
  );
}
