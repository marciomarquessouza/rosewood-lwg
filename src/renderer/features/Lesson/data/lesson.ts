import { ContentNodeType } from "../../../../schemas/lesson";
import { MillerNode } from "../../../components/MillerColumns";

export const lessonContent: MillerNode<ContentNodeType>[] = [
  {
    id: "en-UK",
    name: "English",
    type: "locale",
    children: [
      {
        id: "title",
        name: "Title",
        type: "title",
      },
      {
        id: "entries",
        name: "Entries",
        type: "entries",
        children: [
          {
            id: "1",
            name: "Hello",
            type: "entry",
            children: [
              {
                id: "introduction",
                name: "introduction",
                type: "step",
                children: [],
              },
              {
                id: "listening",
                name: "listening",
                type: "step",
                children: [],
              },
              {
                id: "pronunciation",
                name: "pronunciation",
                type: "step",
                children: [],
              },
              {
                id: "writing",
                name: "writing",
                type: "step",
                children: [],
              },
            ],
          },
          {
            id: "2",
            name: "Good morning",
            type: "entry",
            children: [],
          },
          {
            id: "3",
            name: "Goodbye",
            type: "entry",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "de-DE",
    name: "German",
    type: "locale",
    children: [],
  },
];
