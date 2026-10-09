import { LessonEntryBase } from "../../../../schemas/lesson";

export function getNextId(entries: Record<string, LessonEntryBase>) {
  const ids = Object.keys(entries).map(Number);

  return String(ids.length ? Math.max(...ids) + 1 : 1);
}
