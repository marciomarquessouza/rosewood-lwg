import { MillerColumns, MillerNode } from "../../components/MillerColumns";
import { Panel } from "../../components/Panel";

const nodes: MillerNode<"locale" | "entry" | "step" | "title">[] = [
  {
    id: "en-UK",
    name: "English",
    type: "locale",
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
  {
    id: "de-DE",
    name: "German",
    type: "locale",
    children: [],
  },
];

export function LessonForm() {
  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden pb-4"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">Lesson</p>
        </div>
      }
    >
      <p>Lesson Content</p>
      <MillerColumns root={nodes} creatableNodeTypes={["entry"]} />
    </Panel>
  );
}
