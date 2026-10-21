import { useState, SubmitEvent } from "react";
import { z } from "zod";
import {
  AlternativeLine,
  AlternativeLineSchema,
  BaseLine,
  CharacterMood,
  DialogueLine,
  DialogueLineSchema,
  InputLine,
  InputLineSchema,
  InteractionTypes,
  Mood,
} from "../../../../schemas/dialogues";
import { BaseLineFields } from "./FieldsBaseLine";
import { DialogueFields } from "./FieldsDialogue";
import { Button } from "../../../components/Button";
import { AlternativeFields } from "./FieldsAlternative";
import { InputFields } from "./FieldsInput";

type InteractionLine = DialogueLine | AlternativeLine | InputLine;

type Character = DialogueLine["character"];

export type Option<T> = {
  label: string;
  value: T;
  defaultOption?: boolean;
};

type Props = {
  characters: Option<Character>[];
  moods: Option<Mood>[];
  saving?: boolean;
  line?: InteractionLine;
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
  line,
  onSave,
}: Props) {
  const isUpdate = Boolean(line);
  const [type, setType] = useState<InteractionTypes>(line?.type ?? "dialogue");

  const [text, setText] = useState(line?.text ?? "");
  const [character, setCharacter] = useState<Character>(
    line?.character ?? characters[0]?.value,
  );
  const [reactions, setReactions] = useState<CharacterMood[]>(
    line?.moods ?? [],
  );

  const [alternatives, setAlternatives] = useState(
    line?.type === "alternatives" ? line.alternatives : [],
  );
  const [inputLabel, setInputLabel] = useState(
    line?.type === "input" ? line.inputLabel : "",
  );
  const [error, setError] = useState<string | null>(null);

  const base: BaseLine = {
    text,
    character,
    moods: reactions,
  };

  const getLine = (): unknown => {
    switch (type) {
      case "dialogue":
        return { ...base, type };

      case "alternatives": {
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
    <form
      onSubmit={handleSubmit}
      className="flex h-full min-h-0 flex-col min-w-120"
    >
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Dialogue Line
          </p>
          {!isUpdate && (
            <p className="mt-1 text-xs text-rosewood-ink/60">
              Select the interaction type and configure its fields.
            </p>
          )}
        </div>

        {!isUpdate && (
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
        )}

        <BaseLineFields
          text={text}
          character={character}
          moods={moods}
          characters={characters}
          reactions={reactions}
          onTextChange={setText}
          onCharacterChange={setCharacter}
          onReactionChange={(reaction) =>
            setReactions((values) => [...values, reaction])
          }
        />

        {type === "dialogue" && <DialogueFields />}

        {type === "alternatives" && (
          <AlternativeFields
            alternatives={alternatives}
            onChange={setAlternatives}
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
          {saving
            ? isUpdate
              ? "Updating..."
              : "Creating..."
            : isUpdate
              ? "Update Line"
              : "Create Line"}
        </Button>
      </div>
    </form>
  );
}
