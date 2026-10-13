import { LessonContentNodeType } from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";

export const createLessonTitleTree = (): MillerNode<LessonContentNodeType> => ({
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
});
