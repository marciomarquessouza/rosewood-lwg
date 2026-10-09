import { Outlet } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { ContentTree } from "../features/ContentTree";

export function ProjectLayout() {
  return (
    <div className="flex h-full min-h-0 flex-row gap-8">
      <SideNavigation>
        <ContentTree />
      </SideNavigation>
      <Outlet />
    </div>
  );
}
