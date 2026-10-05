import { DayDirectory, dayDirectorySchema } from "../../../../schemas/day";

export function dayDirectoryToNumber(dayDirectory: DayDirectory): number {
  return Number(dayDirectory.replace("day_", ""));
}

export function numberToDayDirectory(day: number): DayDirectory {
  return dayDirectorySchema.parse(`day_${String(day).padStart(2, "0")}`);
}
