import { ProjectOptions } from "../../../../schemas/project";
import { DaysContent } from "../../../../shared/day";

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
