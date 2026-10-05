import { DayDirectory } from "../../../../schemas/day";
import { dayDirectoryToNumber, numberToDayDirectory } from "./transformDays";

export function getNextDay(days?: DayDirectory[]): DayDirectory {
  if (!days?.length) {
    return numberToDayDirectory(1);
  }

  const lastDay = Math.max(...days.map(dayDirectoryToNumber));

  return numberToDayDirectory(lastDay + 1);
}
