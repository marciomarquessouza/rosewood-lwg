import { LANGUAGE_DETAILS } from "../../../../constants";
import { DayLessonContent } from "../../../../schemas/day";
import { Language } from "../../../../schemas/language";
import { ContentNodeType } from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";

export function buildLessonContentTree(
  dayLessonContent: DayLessonContent,
): MillerNode<ContentNodeType>[] {
  return Object.keys(dayLessonContent.locales).map((key) => {
    const locale = key as Language;
    const root: MillerNode<ContentNodeType> = {
      id: locale,
      name: LANGUAGE_DETAILS[locale].name,
      type: "locale",
      children: [],
    };

    const title: MillerNode<ContentNodeType> = {
      id: "title",
      name: "Title",
      type: "title",
      children: [
        {
          id: "title-form",
          name: "Title Form",
          type: "form",
        },
      ],
    };

    const entries: MillerNode<ContentNodeType> = {
      id: "entries",
      name: "Entries",
      type: "entries",
      children: [],
    };

    const lessonEntries = dayLessonContent.lesson.entries;
    const entryNodes: MillerNode<ContentNodeType>[] = lessonEntries
      ? Object.keys(lessonEntries).map((entryKey) => ({
          id: `${lessonEntries[entryKey].sequence}`,
          name: lessonEntries[entryKey].target,
          type: "entry",
        }))
      : [];

    entries.children = entryNodes;

    root.children = [title, entries];

    if (entryNodes.length > 0) {
      dayLessonContent.locales[locale]?.lesson.entries;
    }

    return root;
  });
}
