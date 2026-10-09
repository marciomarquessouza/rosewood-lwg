import { Outlet } from "react-router-dom";
import { SourcePanel } from "../features/SourcePanel";

export function ProjectLayout() {
  return (
    <div className="flex h-full min-h-0 flex-row gap-8">
      <SourcePanel />
      <Outlet />
    </div>
  );
}
