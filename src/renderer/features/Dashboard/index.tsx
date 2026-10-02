import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { Feedback, FeedbackTypes } from "../../components/Feedback";
import { Panel } from "../../components/Panel";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { SourcePanel } from "../SourcePanel";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardItem } from "./DashboardItem";

export function Dashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { projectContent, error } = useProjectContent();

  const [feedback, setFeedback] = useState<{
    type: FeedbackTypes;
    message: string;
  } | null>(null);

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
          <DashboardHeader lines={projectContent?.lines.length ?? 0} />
        }
        footer={
          <div className="flex flex-1 items-end justify-end">
            <Button
              variant="dark"
              onClick={() => navigate("/project/new")}
            >
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
          <>
            {feedback && (
              <Feedback
                variant={feedback.type}
                className="my-2"
              >
                {feedback.message}
              </Feedback>
            )}

            <ul className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
              {projectContent.lines.map((line) => (
                <li key={`${line.language}-${line.level}`}>
                  <DashboardItem
                    {...line}
                    onFeedback={setFeedback}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </div>
  );
}