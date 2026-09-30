import { ProjectContent } from "../../../shared/project.ts";
import { Panel } from "../../components/Panel/index.tsx";
import { useProject } from "../../contexts/ProjectContext";
import { SourcePanel } from "../SourcePanel";
import { DashboardHeader } from "./DashboardHeader.tsx";
import { DashboardItem } from "./DashboardItem.tsx";

export function Dashboard() {
  const { connected } = useProject();
  const lines: ProjectContent = {
    lessonLanguages: [
      { language: "de-DE", levels: ["A1-1"]}
    ]
  }

  return (
    <div className="flex flex-row gap-16">
      <SourcePanel />
      <Panel header={<DashboardHeader lines={lines.lessonLanguages.length} />}>
        {!connected ? (
          <p className=" text-md">
            <span className=" text-rosewood-accent">◆</span> Not Connected
          </p>
        ) : (
          <>
          Dashboard
          </>
          
        )}
      </Panel>
    </div>
  );
}
