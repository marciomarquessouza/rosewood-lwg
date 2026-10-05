import { useState } from "react";
import { DEFAULT_DIALOGUES, GameScene } from "../../../constants/dialogues";
import { DialogueKey } from "../../../schemas/dialogues";
import { Select } from "../../components/Select";
import { capitalize } from "../../../utils/string";
import { Checkbox } from "../../components/Checkbox";

const defaultDialogueList = Object.keys(DEFAULT_DIALOGUES).map((key) => ({
  key,
  ...DEFAULT_DIALOGUES[key as DialogueKey],
  skip: false,
}));

const FILTER_OPTIONS = ["CELL", "DREAM", "TRAIN", "ALL"] as const;

type SceneFilter = GameScene | "ALL";

export function DialogueList() {
  const [filter, setFilter] = useState<SceneFilter>("ALL");
  const [dialogueList, setDialogueList] = useState(defaultDialogueList);

  const filteredDialogueList =
    filter === "ALL"
      ? dialogueList
      : dialogueList.filter((dialogue) => dialogue.scene === filter);

  const handleSkipChange = (key: string, skip: boolean) => {
    setDialogueList((current) =>
      current.map((dialogue) =>
        dialogue.key === key ? { ...dialogue, skip } : dialogue,
      ),
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-rosewood-ink">Dialogues</h2>

        <Select
          id="filter"
          label="Filter By Scene"
          value={filter}
          className="w-38"
          onChange={(event) =>
            setFilter(event.target.value as SceneFilter)
          }
          options={FILTER_OPTIONS.map((option) => ({
            value: option,
            label: capitalize(option),
          }))}
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
            {filteredDialogueList.map((dialogue) => (
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
                    <Checkbox
                      label="Skip"
                      checked={dialogue.skip}
                      onChange={(event) =>
                        handleSkipChange(
                          dialogue.key,
                          event.target.checked,
                        )
                      }
                    />
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