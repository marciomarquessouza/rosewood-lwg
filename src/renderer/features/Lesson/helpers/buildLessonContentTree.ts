import { LANGUAGE_DETAILS } from "../../../../constants";
import { DayLessonContent } from "../../../../schemas/day";
import { Language } from "../../../../schemas/language";
import { LessonContentNodeType } from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";
import { createLessonEntryTree } from "./createLessonEntryTree";
import { createLessonTitleTree } from "./createLessonTitleTree";

export function buildLessonContentTree(
  dayLessonContent: DayLessonContent,
): MillerNode<LessonContentNodeType>[] {
  return Object.keys(dayLessonContent.locales).map((key) => {
    const locale = key as Language;
    const root: MillerNode<LessonContentNodeType> = {
      id: locale,
      name: LANGUAGE_DETAILS[locale].name,
      type: "locale",
      children: [],
    };

    const title = createLessonTitleTree();

    const entries: MillerNode<LessonContentNodeType> = {
      id: "entries",
      name: "Entries",
      type: "entries",
      children: [],
    };

    const lessonEntries = dayLessonContent.lesson.entries;
    const entryNodes: MillerNode<LessonContentNodeType>[] = lessonEntries
      ? Object.keys(lessonEntries).map((entryKey) => ({
          id: `${lessonEntries[entryKey].id}`,
          name: lessonEntries[entryKey].target,
          type: "entry",
        }))
      : [];

    entries.children = entryNodes;

    root.children = [title, entries];

    if (entryNodes.length > 0) {
      entryNodes.forEach((node) => {
        node.children = createLessonEntryTree(node);
      });
    }

    return root;
  });
}
