import { Panel } from "../../components/Panel";

export function LessonForm() {
  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">Lesson</p>
        </div>
      }
    >
      <p>Lesson Content</p>
    </Panel>
  );
}
