import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardItem } from "./DashboardItem";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { useFeedback } from "../../contexts/FeedbackContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { projectContent, error } = useProjectContent();
  const { loadProjectContent } = useProjectContent();
  const [actionLoading, setActionsLoading] = useState<
    "pull" | "push" | "delete" | null
  >(null);
  const isLoading = Boolean(actionLoading);
  const { projectPath } = useProjectInfo();
  const { showFeedback, clearFeedback } = useFeedback();

  const handleDelete = async (language: Language, level: Level) => {
    const confirmed = window.confirm(
      `Remove ${LANGUAGE_DETAILS[language].name} ${level}? This will permanently delete all its content.`,
    );

    if (!confirmed) {
      return;
    }
    clearFeedback();
    setActionsLoading("delete");

    try {
      await window.rosewood.deleteProjectContent(projectPath, language, level);
      await loadProjectContent();
      showFeedback({
        type: "success",
        message: `Project removed - ${language}|${level}`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";

      showFeedback({
        type: "error",
        message,
      });
    } finally {
      setActionsLoading(null);
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
    <Panel
      className="flex min-h-0 flex-1 flex-col"
      header={<DashboardHeader lines={projectContent?.lines.length ?? 0} />}
      footer={
        <div className="flex flex-1 items-end justify-end">
          <Button
            variant="dark"
            disabled={isLoading}
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
          <ul className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
            {projectContent.lines.map((line) => (
              <li key={`${line.language}-${line.level}`}>
                <DashboardItem
                  {...line}
                  loading={actionLoading === "delete"}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
