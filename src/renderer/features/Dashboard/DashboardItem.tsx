import { useNavigate } from "react-router-dom";
import { LANGUAGE_DETAILS } from "../../../constants";
import { ProjectContent } from "../../../schemas/project";
import { ProgressBar } from "../../components/ProgressBar";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { Button } from "../../components/Button";
import { Pill } from "../../components/Pill";

interface DashboardItemProps extends ProjectContent {
  loading: boolean;
  onDelete: (language: Language, level: Level) => void;
}

export function DashboardItem({
  loading,
  level,
  language,
  plannedDays,
  createdDays,
  onDelete,
}: DashboardItemProps) {
  const navigate = useNavigate();

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

          <Button
            variant="light"
            onClick={() => navigate(`/project/${language}/${level}/days`)}
          >
            Day List
          </Button>

          <Button
            variant="accent"
            loading={loading}
            onClick={() => onDelete(language, level)}
          >
            Remove
          </Button>
        </div>
        <ProgressBar value={createdDays} max={plannedDays} />
      </div>
    </div>
  );
}
