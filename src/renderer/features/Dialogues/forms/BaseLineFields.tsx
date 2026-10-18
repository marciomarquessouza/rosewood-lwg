import { Character, Mood } from "../../../../schemas/dialogues";
import { Input } from "../../../components/Input";
import { Option } from "./DialogueLineForm";

type BaseLineFieldsProps = {
  text: string;
  character: Character;
  moods: Mood[];
  speed: string;
  characters: Option<Character>[];
  availableMoods: Option<Mood>[];
  onTextChange: (value: string) => void;
  onCharacterChange: (value: Character) => void;
  onMoodsChange: (value: Mood[]) => void;
  onSpeedChange: (value: string) => void;
};

export function BaseLineFields({
  text,
  character,
  moods,
  speed,
  characters,
  availableMoods,
  onTextChange,
  onCharacterChange,
  onMoodsChange,
  onSpeedChange,
}: BaseLineFieldsProps) {
  return (
    <div className="space-y-5">
      <Input
        label="Text"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Enter dialogue text..."
      />

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
          Character
        </p>

        <select
          value={String(character ?? "")}
          onChange={(event) => {
            const selected = characters.find(
              (option) => String(option.value) === event.target.value,
            );
            if (selected) onCharacterChange(selected.value);
          }}
          className="w-full rounded border border-rosewood-ink/30 bg-white px-3 py-2 text-sm"
        >
          {characters.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
          Moods
        </p>

        {availableMoods.map((option) => (
          <label
            key={String(option.value)}
            className="flex items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={moods.includes(option.value)}
              onChange={(event) =>
                onMoodsChange(
                  event.target.checked
                    ? [...moods, option.value]
                    : moods.filter((mood) => mood !== option.value),
                )
              }
            />
            {option.label}
          </label>
        ))}
      </div>

      <Input
        label="Speed"
        type="number"
        min="0.01"
        step="0.1"
        value={speed}
        onChange={(event) => onSpeedChange(event.target.value)}
        placeholder="Default speed..."
      />
    </div>
  );
}
