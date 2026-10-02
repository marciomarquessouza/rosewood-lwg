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
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";

export function Dashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { projectContent, error } = useProjectContent();
  const { loadProjectContent } = useProjectContent();
  const [loading, setLoading] = useState(false);
  const { projectPath } = useProjectInfo();
  const [feedback, setFeedback] = useState<{
    type: FeedbackTypes;
    message: string;
  } | null>(null);

  const handleDelete = async (language: Language, level: Level) => {
    const confirmed = window.confirm(
      `Remove ${LANGUAGE_DETAILS[language].name} ${level}? This will permanently delete all its content.`,
    );

    if (!confirmed) {
      return;
    }
    setFeedback(null);
    setLoading(true);

    try {
      await window.rosewood.deleteProjectContent(projectPath, language, level);
      await loadProjectContent();
      setFeedback({
        type: "success",
        message: "Scarlett removed your project (She is smiling)",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Scarlett was not able to remove your project (She is crying)";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Button variant="dark" onClick={() => navigate("/project/new")}>
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
                className="mb-2"
                timeout={8_000}
                onTimeout={() => setFeedback(null)}
              >
                {feedback.message}
              </Feedback>
            )}

            <ul className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
              {projectContent.lines.map((line) => (
                <li key={`${line.language}-${line.level}`}>
                  <DashboardItem
                    {...line}
                    loading={loading}
                    onDelete={handleDelete}
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
