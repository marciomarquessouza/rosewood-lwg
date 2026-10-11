import { MillerColumns } from "../../components/MillerColumns";
import { Panel } from "../../components/Panel";
import { lessonContent } from "./data/lesson";

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
      <MillerColumns root={lessonContent} creatableNodeTypes={["entry"]} />
    </Panel>
  );
}
