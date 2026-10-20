import { Character, Mood } from "../../../../schemas/dialogues";
import { Button } from "../../../components/Button";
import { TextArea } from "../../../components/TextArea";
import { Option } from "./DialogueLineForm";

type BaseLineFieldsProps = {
  text: string;
  character: Character;
  mood: Mood;
  moods: Option<Mood>[];
  characters: Option<Character>[];
  onTextChange: (value: string) => void;
  onCharacterChange: (value: Character) => void;
  onMoodChange: (value: Mood) => void;
};

export function BaseLineFields({
  text,
  character,
  characters,
  mood,
  moods,
  onTextChange,
  onCharacterChange,
  onMoodChange,
}: BaseLineFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="space-x-2">
        {characters.map((option) => (
          <Button
            key={option.value}
            variant={character === option.value ? "dark" : "light"}
            onClick={() => onCharacterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <TextArea
        id="dialogue-text"
        label="Text"
        placeholder="Dialogue Text"
        rows={5}
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
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

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
          Moods
        </p>

        <select
          value={String(mood ?? "")}
          onChange={(event) => {
            const selected = moods.find(
              (option) => String(option.value) === event.target.value,
            );
            if (selected) onMoodChange(selected.value);
          }}
          className="w-full rounded border border-rosewood-ink/30 bg-white px-3 py-2 text-sm"
        >
          {moods.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
