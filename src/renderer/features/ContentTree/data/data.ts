import { ContentTreeNode } from "../ContentNode";

export const mockedData: ContentTreeNode[] = [
  {
    id: "root",
    name: "Content",
    type: "root",
    children: [
      {
        id: "de-DE",
        name: "de-DE",
        type: "language",
        children: [
          {
            id: "de-DE/A1-1",
            name: "A1-1",
            type: "level",
            children: [
              {
                id: "de-DE/A1-1/days/day_01",
                name: "day_01",
                type: "day",
                children: [
                  {
                    id: "de-DE/A1-1/days/day_01/dialogues",
                    name: "dialogues",
                    type: "dialogues",
                  },
                  {
                    id: "de-DE/A1-1/days/day_01/lesson",
                    name: "lesson",
                    type: "lesson",
                  },
                ],
              },
              {
                id: "de-DE/A1-1/days/day_02",
                name: "day_02",
                type: "day",
                children: [
                  {
                    id: "de-DE/A1-1/days/day_02/dialogues",
                    name: "dialogues",
                    type: "dialogues",
                  },
                  {
                    id: "de-DE/A1-1/days/day_02/lesson",
                    name: "lesson",
                    type: "lesson",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "en-UK",
        name: "en-UK",
        type: "language",
        children: [
          {
            id: "en-UK/A1-1",
            name: "A1-1",
            type: "level",
            children: [],
          },
        ],
      },
    ],
  },
];
