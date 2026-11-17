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
      id: "details",
      name: "Details",
      type: "details",
      children: [{ id: "form-details", name: "Entry Details", type: "form" }],
    },
    {
      id: "examples",
      name: "Examples",
      type: "examples",
      children: [{ id: "form-examples", name: "Entry Examples", type: "form" }],
    },
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
        id: step,
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
