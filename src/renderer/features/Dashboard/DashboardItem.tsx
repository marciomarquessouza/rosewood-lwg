import { LANGUAGE_DETAILS } from "../../../constants";
import { ProjectContent } from "../../../schemas/project";
import { Pill } from "../../components/Pill";

export function DashboardItem({
  level,
  language,
  plannedDays,
}: ProjectContent) {
  return (
    <div
      className={[
        "bg-rosewood-bg rounded-md border-2 border-rosewood-ink",
        "flex justify-between",
        "my-4",
      ].join(" ")}
    >
      <div className="flex flex-row items-center gap-4 px-4">
        <div>
          <Pill variant="dark">{level}</Pill>
        </div>
        <div>
          <p>{LANGUAGE_DETAILS[language].name}</p>
          <p>{`${0} days of ${plannedDays}`}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
