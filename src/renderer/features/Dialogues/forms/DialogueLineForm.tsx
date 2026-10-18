import { useState, SubmitEvent } from "react";
import { z } from "zod";
import {
  AlternativeLine,
  AlternativeLineSchema,
  DialogueLine,
  DialogueLineSchema,
  InputLine,
  InputLineSchema,
  InteractionTypes,
  Mood,
} from "../../../../schemas/dialogues";
import { BaseLineFields } from "./BaseLineFields";
import {
  AlternativeFields,
  DialogueFields,
  InputFields,
} from "./DialogueFields";
import { Button } from "../../../components/Button";

type InteractionLine = DialogueLine | AlternativeLine | InputLine;

type Character = DialogueLine["character"];

export type Option<T> = {
  label: string;
  value: T;
};

type Props = {
  characters: Option<Character>[];
  moods: Option<Mood>[];
  saving?: boolean;
  onSave: (line: InteractionLine) => void | Promise<void>;
};

const lineSchema = z.discriminatedUnion("type", [
  DialogueLineSchema,
  AlternativeLineSchema,
  InputLineSchema,
]);

const interactionTypes: {
  label: string;
  value: InteractionTypes;
}[] = [
  { label: "Dialogue", value: "dialogue" },
  { label: "Alternatives", value: "alternatives" },
  { label: "Input", value: "input" },
];

export function DialogueLineForm({
  characters,
  moods,
  saving = false,
  onSave,
}: Props) {
  const [type, setType] = useState<InteractionTypes>("dialogue");

  const [text, setText] = useState("");
  const [character, setCharacter] = useState<Character>(characters[0]?.value);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [speed, setSpeed] = useState("");

  const [alternativesText, setAlternativesText] = useState("[]");
  const [inputLabel, setInputLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const base = {
    text,
    character,
    ...(selectedMoods.length > 0 ? { moods: selectedMoods } : {}),
    ...(speed.trim() ? { speed: Number(speed) } : {}),
  };

  const getLine = (): unknown => {
    switch (type) {
      case "dialogue":
        return { ...base, type };

      case "alternatives": {
        let alternatives: unknown;

        try {
          alternatives = JSON.parse(alternativesText);
        } catch {
          throw new Error("Invalid alternatives JSON.");
        }

        return { ...base, type, alternatives };
      }

      case "input":
        return { ...base, type, inputLabel };
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const result = lineSchema.safeParse(getLine());

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Invalid line.");
        return;
      }

      await onSave(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Dialogue Line
          </p>
          <p className="mt-1 text-xs text-rosewood-ink/60">
            Select the interaction type and configure its fields.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Interaction Type
          </label>

          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as InteractionTypes);
              setError(null);
            }}
            className="w-full rounded border border-rosewood-ink/30 bg-white px-3 py-2 text-sm"
          >
            {interactionTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <BaseLineFields
          text={text}
          character={character}
          moods={selectedMoods}
          speed={speed}
          characters={characters}
          availableMoods={moods}
          onTextChange={setText}
          onCharacterChange={setCharacter}
          onMoodsChange={setSelectedMoods}
          onSpeedChange={setSpeed}
        />

        {type === "dialogue" && <DialogueFields />}

        {type === "alternatives" && (
          <AlternativeFields
            value={alternativesText}
            onChange={setAlternativesText}
          />
        )}

        {type === "input" && (
          <InputFields value={inputLabel} onChange={setInputLabel} />
        )}

        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-rosewood-ink/30 p-4">
        <Button
          type="submit"
          disabled={saving || !text.trim() || !characters.length}
        >
          {saving ? "Creating..." : "Create Line"}
        </Button>
      </div>
    </form>
  );
}
