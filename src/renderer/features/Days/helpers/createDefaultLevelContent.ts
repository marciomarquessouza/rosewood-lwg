import { DaysContent } from "../../../../schemas/day";
import { ProjectOptions } from "../../../../schemas/project";

export function createDefaultDaysContent({
  language,
  level,
}: ProjectOptions): DaysContent {
  return {
    language,
    level,
    days: [],
  };
}
