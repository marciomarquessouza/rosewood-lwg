import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { SourcePanel } from "../SourcePanel";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardItem } from "./DashboardItem";
import { useDashboard } from "./hooks/useDashboard";

export function Dashboard() {
  const { connected, projectContent, error } = useDashboard();

  if (error) {
    return (
      <p className="text-md">
        <span className="text-rosewood-accent">◆</span> {error}
      </p>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-row gap-16">
      <SourcePanel />

      <Panel
        className="flex min-h-0 flex-1 flex-col"
        header={
          <DashboardHeader
            lines={projectContent?.lines.length ?? 0}
          />
        }
        footer={
          <div className="flex flex-1 items-end justify-end">
            <Button variant="dark">
              Add New Language/Level
            </Button>
          </div>
        }
      >
        {!connected ? (
          <p className="text-md">
            <span className="text-rosewood-accent">◆</span>{" "}
            Not Connected
          </p>
        ) : !projectContent ? (
          <p className="text-md">
            <span className="text-rosewood-accent">◆</span>{" "}
            Loading...
          </p>
        ) : (
          <ul className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
            {projectContent.lines.map((line) => (
              <li key={`${line.language}-${line.level}`}>
                <DashboardItem {...line} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}