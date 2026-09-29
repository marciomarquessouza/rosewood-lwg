import { Dashboard } from "./features/Dashboard";
import { LanguageLevelForm } from "./features/LanguageLevel/LanguageLevelForm";
import { AppLayout } from "./layouts/AppLayout";
import { HashRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/language/:language/:level"
            element={<LanguageLevelForm />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
