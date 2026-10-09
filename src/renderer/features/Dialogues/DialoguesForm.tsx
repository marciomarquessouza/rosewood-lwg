import { Panel } from "../../components/Panel";

export function DialoguesForm() {
  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">Dialogues</p>
        </div>
      }
    >
      <p>Dialogues Content</p>
    </Panel>
  );
}
