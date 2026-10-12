import { ContentNodeType } from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";

export const createLessonTitleTree = (): MillerNode<ContentNodeType> => ({
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
