import {
  LessonContentNodeType,
  LESSON_STEPS,
} from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";

export function createLessonEntryTree(
  node: MillerNode<LessonContentNodeType>,
): MillerNode<LessonContentNodeType>[] {
  return [
    {
      id: `audio-${node.id}`,
      name: "audio",
      type: "audio",
      children: [
        {
          id: "form-audio",
          name: "Audio Form",
          type: "form",
        },
      ],
    },
    {
      id: "steps",
      name: "steps",
      type: "steps",
      children: LESSON_STEPS.map((step) => ({
        id: `step-${step}`,
        name: step,
        type: "step",
        children: [
          {
            id: `form-${step}`,
            name: step,
            type: "form",
          },
        ],
      })),
    },
  ];
}
