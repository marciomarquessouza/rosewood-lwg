import { useNavigate } from "react-router-dom";
import { DayLessonContent } from "../../../schemas/day";
import { Button } from "../../components/Button";
import { Pill } from "../../components/Pill";

interface DayItemProps extends DayLessonContent {
  onDayEdit: () => void;
}

export function DayItem({ day, label, description, onDayEdit }: DayItemProps) {
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
          <Pill variant="dark">{String(day).padStart(2, "0")}</Pill>
        </div>
        <div>
          <p className="font-bold my-0">{label}</p>
          <span className="text-sm font-light my-0">{description}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-3">
          <Button variant="light" onClick={() => navigate(`/`)}>
            Add Locales
          </Button>
        </div>
      </div>
    </div>
  );
}
