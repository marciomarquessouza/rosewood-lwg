import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-rosewood-bg p-3">
      <div className="min-h-[calc(100vh-24px)] border border-dashed border-rosewood-ink/50">
        <Header />
        <main className="px-6 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
