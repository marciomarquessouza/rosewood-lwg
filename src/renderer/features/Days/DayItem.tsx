import { useNavigate } from "react-router-dom";
import { DayLessonContent } from "../../../schemas/day";
import { Button } from "../../components/Button";
import { Pill } from "../../components/Pill";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { numberToDayDirectory } from "./utils/transformDays";

interface DayItemProps {
  language: Language,
  level: Level,
  dayLessonContent: DayLessonContent
}

export function DayItem({ language, level, dayLessonContent }: DayItemProps) {
  const navigate = useNavigate();
  return (
    <div
      className={[
        " bg-rosewood-surface rounded-md border-2 border-rosewood-ink my-3",
        "flex justify-between px-1",
      ].join(" ")}
    >
      <div className="flex flex-row items-center gap-4 px-4 py-2">
        <div>
          <Pill variant="dark">{String(dayLessonContent.day).padStart(2, "0")}</Pill>
        </div>
        <div>
          <p className="font-bold my-0">{dayLessonContent.label}</p>
          <span className="text-sm font-light my-0">{dayLessonContent.description}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-3 pr-4">
          <Button variant="light" onClick={() => navigate(`/project/${language}/${level}/days/${numberToDayDirectory(dayLessonContent.day)}`)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
