import { HashRouter, Route, Routes, Outlet } from "react-router-dom";

import { DaysContentProvider } from "./contexts/DaysContentContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";
import { ProjectContentProvider } from "./contexts/ProjectContentContext";
import { ProjectInfoProvider } from "./contexts/ProjectInfoContext";

import { Dashboard } from "./features/Dashboard";
import { DayForm } from "./features/Days/DayForm";
import { DayList } from "./features/Days/DayList";
import { ProjectForm } from "./features/Projects/ProjectForm";

import { AppLayout } from "./layouts/AppLayout";
import { ProjectLayout } from "./layouts/ProjectLayout";

export function App() {
  return (
    <HashRouter>
      <FeedbackProvider>
        <ProjectInfoProvider>
          <ProjectContentProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route element={<ProjectLayout />}>
                  <Route index element={<Dashboard />} />

                  <Route path="project/new" element={<ProjectForm />} />

                  <Route
                    path="project/:language"
                    element={<ProjectForm />}
                  />

                  <Route
                    path="project/:language/:level"
                    element={<ProjectForm />}
                  />

                  <Route element={<DaysContentProvider />}>
                    <Route
                      path="project/:language/:level/days"
                      element={<DayList />}
                    />

                    <Route
                      path="project/:language/:level/days/:day"
                      element={<DayForm />}
                    />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </ProjectContentProvider>
        </ProjectInfoProvider>
      </FeedbackProvider>
    </HashRouter>
  );
}
