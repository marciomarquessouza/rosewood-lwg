import { Panel } from "../../components/Panel/index.tsx";
import { SourcePanel } from "../SourcePanel";
import { DashboardHeader } from "./DashboardHeader.tsx";
import { DashboardItem } from "./DashboardItem.tsx";
import { useDashboard } from "./hooks/useDashboard.ts";

export function Dashboard() {
  const { connected, projectContent, error } = useDashboard();

  if (error) {
    return (
      <p className=" text-md">
        <span className=" text-rosewood-accent">◆</span> {error}
      </p>
    );
  }

  return (
    <div className="flex flex-row gap-16">
      <SourcePanel />
      <Panel
        header={<DashboardHeader lines={projectContent?.lines.length ?? 0} />}
      >
        {!connected ? (
          <p className=" text-md">
            <span className=" text-rosewood-accent">◆</span> Not Connected
          </p>
        ) : !projectContent ? (
          <p className=" text-md">
            <span className=" text-rosewood-accent">◆</span> {error}
          </p>
        ) : (
          projectContent.lines.map((line) => (
            <DashboardItem key={`${line.language}-${line.level}`} {...line}/>
          ) )
          
        )}
      </Panel>
    </div>
  );
}
