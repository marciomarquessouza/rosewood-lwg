import { LANGUAGE_DETAILS } from "../../../constants";
import { Pill } from "../../components/Pill";

interface DashboardItemProps {
  level: string;
  language: string;
  plannedDays: number;
  completedDays: number;
}

export function DashboardItem({
  level,
  language,
  plannedDays,
  completedDays,
}: DashboardItemProps) {
  return (
    <div
      className={[
        "bg-rosewood-bg rounded-md border-2 border-rosewood-ink",
        "flex justify-between",
      ].join(" ")}
    >
      <div>
        <Pill variant="dark">{level}</Pill>
        <div>
          <p>{LANGUAGE_DETAILS["de-DE"].name}</p>
          <p>{`${plannedDays} days of ${completedDays}`}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
