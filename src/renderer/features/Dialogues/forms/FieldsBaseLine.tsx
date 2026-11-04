import { useState } from "react";
import { CharacterMood, Mood } from "../../../../schemas/dialogues";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { TextArea } from "../../../components/TextArea";
import { Option } from "./DialogueLineForm";
import { Character } from "sue-tissue-lwg/schemas/actors";

type BaseLineFieldsProps = {
  text: string;
  character: Character;
  moods: Option<Mood>[];
  characters: Option<Character>[];
  reactions: CharacterMood[];
  onTextChange: (value: string) => void;
  onCharacterChange: (value: Character) => void;
  onReactionChange: (reaction: CharacterMood) => void;
};

export function BaseLineFields({
  text,
  character,
  characters,
  moods,
  reactions,
  onTextChange,
  onCharacterChange,
  onReactionChange,
}: BaseLineFieldsProps) {
  const [reactionCharacter, setReactionCharacter] = useState<Character>(
    characters[0]?.value,
  );
  const [mood, setMood] = useState<Mood>(moods[0]?.value);

  const isDuplicate = reactions.some(
    (reaction) =>
      reaction.character === reactionCharacter && reaction.mood === mood,
  );

  const canAddReaction = Boolean(reactionCharacter && mood) && !isDuplicate;

  const handleAddReaction = () => {
    if (!canAddReaction) return;

    onReactionChange({
      character: reactionCharacter,
      mood,
    });
  };

  const getCharacterLabel = (value: Character) =>
    characters.find((option) => option.value === value)?.label ?? value;

  const getMoodLabel = (value: Mood) =>
    moods.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="space-y-6">
      {/* Main character */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
          Character
        </h3>

        <div className="flex flex-wrap gap-2">
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
      </section>

      {/* Dialogue text */}
      <TextArea
        id="dialogue-text"
        label="Text"
        placeholder="Enter dialogue text..."
        rows={5}
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
      />

      {/* Reactions */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Reactions
          </h3>

          <p className="text-xs text-rosewood-ink/50">
            Define how characters react during this dialogue.
          </p>
        </div>

        {/* Add reaction */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-36 max-w-sm flex-1">
            <Select
              label="Character"
              options={characters}
              value={reactionCharacter}
              onChange={(event) =>
                setReactionCharacter(event.target.value as Character)
              }
            />
          </div>

          <div className="min-w-36 max-w-sm flex-1">
            <Select
              label="Mood"
              options={moods}
              value={mood}
              onChange={(event) => setMood(event.target.value as Mood)}
            />
          </div>

          <div className="flex h-12 shrink-0 items-center">
            <Button onClick={handleAddReaction} disabled={!canAddReaction}>
              Add
            </Button>
          </div>
        </div>

        {/* Reaction list */}
        {reactions.length > 0 ? (
          <div className="space-y-2">
            {reactions.map((reaction, index) => (
              <div
                key={`${reaction.character}-${reaction.mood}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-rosewood-ink/10 px-4 py-3"
              >
                <span className="text-sm font-medium text-rosewood-ink">
                  {getCharacterLabel(reaction.character)}
                </span>

                <span className="rounded-md bg-rosewood-ink/5 px-3 py-1 text-xs font-medium text-rosewood-ink/70">
                  {getMoodLabel(reaction.mood)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-rosewood-ink/15 px-4 py-5 text-center">
            <p className="text-xs text-rosewood-ink/40">
              No reactions added yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
