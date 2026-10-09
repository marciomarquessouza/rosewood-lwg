import { DayDirectory } from "../../../../schemas/day";
import { ProjectDay } from "../../../../schemas/project";
import { dayDirectoryToNumber, numberToDayDirectory } from "./transformDays";

export function getNextDay(projectDays?: ProjectDay[]): DayDirectory {
  if (!projectDays?.length) {
    return numberToDayDirectory(1);
  }

  const days = projectDays.map((projectDay) => projectDay.directory);

  const lastDay = Math.max(...days.map(dayDirectoryToNumber));

  return numberToDayDirectory(lastDay + 1);
}
