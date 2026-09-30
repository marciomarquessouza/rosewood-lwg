import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function AppLayout() {
  return (
    <div className="h-screen overflow-hidden bg-rosewood-bg p-3">
      <div className="flex h-full min-h-0 flex-col border border-dashed border-rosewood-ink/50">
        <Header />

        <main className="flex min-h-0 flex-1 flex-col px-6 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
