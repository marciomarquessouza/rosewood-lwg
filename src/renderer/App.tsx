import { Dashboard } from "./features/Dashboard";
import { AppLayout } from "./layouts/AppLayout";

export function App() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
