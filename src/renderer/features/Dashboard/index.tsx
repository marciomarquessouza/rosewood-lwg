import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { SourcePanel } from "../SourcePanel";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardItem } from "./DashboardItem";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";

export function Dashboard() {
  const { connected } = useProjectInfo();
  const { projectContent, error } = useProjectContent();
  const navigate = useNavigate();

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
        header={<DashboardHeader lines={projectContent?.lines.length ?? 0} />}
        footer={
          <div className="flex flex-1 items-end justify-end">
            <Button onClick={() => navigate("/project/new")} variant="dark">
              Add New Language/Level
            </Button>
          </div>
        }
      >
        {!connected ? (
          <p className="text-md">
            <span className="text-rosewood-accent">◆</span> Not Connected
          </p>
        ) : !projectContent ? (
          <p className="text-md">
            <span className="text-rosewood-accent">◆</span> Loading...
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
