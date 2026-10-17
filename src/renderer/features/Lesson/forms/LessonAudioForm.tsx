import { SubmitEvent, useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export interface LessonAudioFormProps {
  locale: string;
  target: string;
  audioPath?: string;
  generating?: boolean;
  onGenerate: () => Promise<void> | void;
  onPlay: (path: string) => Promise<void> | void;
}

export function LessonAudioForm({
  locale,
  target,
  audioPath,
  generating = false,
  onGenerate,
  onPlay,
}: LessonAudioFormProps) {
  const [error, setError] = useState<string | null>(null);

  const isValid = target.trim().length > 0;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || generating) return;

    setError(null);

    try {
      await onGenerate();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate audio",
      );
    }
  };

  const handlePlay = async () => {
    if (!audioPath || generating) return;

    setError(null);

    try {
      await onPlay(audioPath);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to play audio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Audio Generator
          </p>
          <p className="mt-1 text-xs text-rosewood-ink/60">Locale: {locale}</p>
        </div>

        <Input label="Text to Speech" value={target} readOnly />

        <Input label="Voice Language" value={locale} readOnly />

        <Input
          label="Generated Audio Path"
          value={audioPath ?? ""}
          placeholder="No audio generated yet"
          readOnly
        />

        {error && <p className="text-xs text-rosewood-accent">{error}</p>}
      </div>

      <div className="flex gap-2 border-t border-dashed border-rosewood-ink/30 p-4">
        <Button
          type="button"
          disabled={!audioPath || generating}
          onClick={handlePlay}
        >
          Play Audio
        </Button>

        <Button type="submit" disabled={!isValid || generating}>
          {generating
            ? "Generating..."
            : audioPath
              ? "Regenerate Audio"
              : "Generate Audio"}
        </Button>
      </div>
    </form>
  );
}
