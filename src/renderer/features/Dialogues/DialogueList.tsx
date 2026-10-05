import { useState } from "react";
import { DEFAULT_DIALOGUES, GameScene } from "../../../constants/dialogues";
import { DialogueKey } from "../../../schemas/dialogues";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";

const defaultDialogueList = Object.keys(DEFAULT_DIALOGUES).map((key) => ({
    key,
    ...DEFAULT_DIALOGUES[key as DialogueKey],
  }))


export function DialogueList() {
  const [filter, setFilter] = useState<GameScene & "ALL">(
    "ALL",
  );
  useState(defaultDialogueList)

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-rosewood-ink">Dialogues</h2>

        <Button
          variant="light"
          onClick={handleAdd}
          disabled={form !== null}
        ></Button>
        <Select
          id="filter"
          label="Filter By"
          value={state.language}
          className="w-38"
          onChange={(event) => setLanguage(event.target.value as Language)}
          options={supportedLanguages}
        />
      </header>

      <div className="overflow-hidden rounded-md border-2 border-rosewood-ink">
        <table className="w-full border-collapse text-left">
          <thead className="bg-rosewood-surface">
            <tr className="border-b-2 border-rosewood-ink">
              <th className="w-24 px-3 py-2">Scene</th>
              <th className="px-3 py-2">Label</th>
              <th className="w-48 px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {dialogueList.map((dialogue) => (
              <tr
                key={dialogue.key}
                className="border-b border-rosewood-ink last:border-b-0"
              >
                <td className="px-3 py-3 font-bold text-rosewood-accent">
                  {dialogue.scene}
                </td>

                <td className="px-3 py-3 font-bold text-rosewood-ink">
                  {dialogue.label}
                </td>

                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button variant="light">Edit</Button>

                    <Button variant="accent">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
