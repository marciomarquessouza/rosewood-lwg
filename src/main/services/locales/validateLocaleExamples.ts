import type { DayLessonLocales } from "../../../schemas/locales";

/** Keep this check at the persistence boundary, not only in the form. */
export function validateLocaleExamples(content: DayLessonLocales): void {
  for (const [entryId, entry] of Object.entries(content.lesson.entries)) {
    if (!entry.examples) continue;
    if (entry.examples.length === 0) {
      throw new Error(`Entry ${entryId}: at least one example is required`);
    }
    const ids = new Set<string>();
    for (const example of entry.examples) {
      const id = example.id.trim();
      if (!/^[a-zA-Z0-9-]+$/.test(id)) {
        throw new Error(`Entry ${entryId}: example ID must contain only letters, numbers or hyphens`);
      }
      if (ids.has(id)) {
        throw new Error(`Entry ${entryId}: duplicate example ID "${id}"`);
      }
      ids.add(id);
      if (!example.text.trim() || !example.translation.trim()) {
        throw new Error(`Entry ${entryId}, example ${id}: text and translation are required`);
      }
    }
  }
}
