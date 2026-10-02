import { useNavigate } from "react-router-dom";
import { LANGUAGE_DETAILS } from "../../../constants";
import { ProjectContent } from "../../../schemas/project";
import { Button } from "../../components/Button";
import { Pill } from "../../components/Pill";
import { ProgressBar } from "../../components/ProgressBar";
import { useState } from "react";
import { FeedbackTypes } from "../../components/Feedback";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useProjectContent } from "../../contexts/ProjectContentContext";

interface DashboardItemProps extends ProjectContent {
  onFeedback: (feedback: { type: FeedbackTypes; message: string } | null) => void;
}

export function DashboardItem({
  level,
  language,
  plannedDays,
  createdDays,
  onFeedback,
}: DashboardItemProps) {
  const navigate = useNavigate();
  const { loadProjectContent } = useProjectContent();
  const [loading, setLoading] = useState(false);
  const { projectPath } = useProjectInfo();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Remove ${LANGUAGE_DETAILS[language].name} ${level}? This will permanently delete all its content.`,
    );

    if (!confirmed) {
      return;
    }
    onFeedback(null);
    setLoading(true);

    try {
      await window.rosewood.deleteProjectContent(projectPath, language, level);
      await loadProjectContent();
      onFeedback({
        type: "success",
        message: "Scarlett removed your project (She is smiling)",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Scarlett was not able to remove your project (She is crying)";

      onFeedback({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={[
        " bg-rosewood-surface rounded-md border-2 border-rosewood-ink",
        "flex justify-between px-1",
      ].join(" ")}
    >
      <div className="flex flex-row items-center gap-4 px-4 py-2">
        <div>
          <Pill variant="dark">{level}</Pill>
        </div>
        <div>
          <p className="font-bold my-0">{`${LANGUAGE_DETAILS[language].name} [${language}]`}</p>
          <span className="text-sm font-light my-0">{`${createdDays} ${createdDays > 2 ? "days" : "day"} of ${plannedDays}`}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-3">
          <Button
            variant="light"
            onClick={() => navigate(`/project/${language}/${level}`)}
          >
            Edit
          </Button>

          <Button variant="light">Day List</Button>

          <Button variant="accent" loading={loading} onClick={handleDelete}>
            Remove
          </Button>
        </div>
        <ProgressBar value={createdDays} max={plannedDays} />
      </div>
    </div>
  );
}
