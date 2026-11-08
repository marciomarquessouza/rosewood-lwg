import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language, languageSchema } from "../../../schemas/language";
import { Level, levelSchema } from "../../../schemas/level";
import { useFeedback } from "../../contexts/FeedbackContext";
import { Pill } from "../../components/Pill";
import { DashboardItem } from "./components/DashboardItem";

export function ProjectDashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { filterProjectLines, error } = useProjectContent();
  const { language: languageParam, level: levelParam } = useParams();
  const language = languageParam
    ? languageSchema.parse(languageParam)
    : undefined;
  const level = levelParam ? levelSchema.parse(levelParam) : undefined;
  const { loadProjectContent } = useProjectContent();
  const [actionLoading, setActionsLoading] = useState<
    "pull" | "push" | "delete" | null
  >(null);
  const isLoading = Boolean(actionLoading);
  const { projectPath } = useProjectInfo();
  const { showFeedback, clearFeedback } = useFeedback();
  const projectLines = filterProjectLines({
    language,
    level,
  });
  const linesQnt = projectLines.length ?? 0;

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
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-3xl font-bold uppercase">Lessons Dashboard</p>

            <p className="text-base text-rosewood-accent">
              Language/Level Overview
            </p>
          </div>

          <Pill variant="accent">
            {linesQnt} {linesQnt === 1 ? "item" : "items"}
          </Pill>
        </div>
      }
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
      ) : !projectLines ? (
        <p className="text-md">
          <span className="text-rosewood-accent">◆</span> Loading...
        </p>
      ) : (
        <>
          <ul className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
            {projectLines.map((line) => (
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
