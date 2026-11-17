import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import type { LessonLocaleExample } from "../../../../schemas/lesson";

interface Props {
  entryId: string;
  target: string;
  legacyAudio?: string;
  locale: string;
  initialExamples?: LessonLocaleExample[];
  saving: boolean;
  onSave: (examples: LessonLocaleExample[]) => Promise<void>;
  onGenerateAudio: (text: string, exampleId: string) => Promise<string>;
  onPlayAudio: (path: string) => Promise<void>;
}

export function EntryExamplesForm({
  entryId, target, legacyAudio, locale, initialExamples, saving,
  onSave, onGenerateAudio, onPlayAudio,
}: Props) {
  // Legacy fallback is displayed but is never written until explicitly saved.
  const initial = (): LessonLocaleExample[] => initialExamples ?? [
    { id: "1", text: target, translation: "", ...(legacyAudio ? { audio: legacyAudio } : {}) },
  ];
  const [examples, setExamples] = useState<LessonLocaleExample[]>(initial);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { setExamples(initial()); setError(""); }, [
    entryId, target, legacyAudio, locale, initialExamples,
  ]);
  const dirty = JSON.stringify(examples) !== JSON.stringify(initial());
  const valid = examples.length > 0 && examples.every((e) => !!e.text.trim());
  const patch = (id: string, changes: Partial<LessonLocaleExample>) =>
    setExamples((current) => current.map((e) => e.id === id ? { ...e, ...changes } : e));
  const add = () => {
    setExamples((current) => {
      let n = 1;
      while (current.some((e) => e.id === String(n))) n++;
      return [...current, { id: String(n), text: "", translation: "" }];
    });
  };
  const move = (index: number, offset: number) => {
    setExamples((current) => {
      const next = [...current];
      const other = index + offset;
      if (other < 0 || other >= next.length) return current;
      [next[index], next[other]] = [next[other], next[index]];
      return next;
    });
  };
  const generate = async (example: LessonLocaleExample) => {
    if (!example.text.trim() || saving || generatingId) return;
    setError("");
    setGeneratingId(example.id);
    try {
      const audio = await onGenerateAudio(example.text.trim(), example.id);
      patch(example.id, { audio });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setGeneratingId(null);
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid || !dirty || saving || generatingId) return;
    setError("");
    try {
      await onSave(examples.map((e) => ({
        ...e, text: e.text.trim(), translation: e.translation.trim(),
      })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <p className="text-xs text-rosewood-ink/60">Locale: {locale}</p>
        {examples.map((example, index) => (
          <section key={example.id} className="space-y-3 rounded-md border border-rosewood-ink/30 p-3">
            <div className="flex items-center justify-between">
              <strong>Example {index + 1}</strong>
              <div className="flex gap-1">
                <button type="button" aria-label="Move up" disabled={index === 0 || saving}
                  onClick={() => move(index, -1)}>↑</button>
                <button type="button" aria-label="Move down"
                  disabled={index === examples.length - 1 || saving}
                  onClick={() => move(index, 1)}>↓</button>
                <button type="button" aria-label="Remove example"
                  disabled={examples.length === 1 || saving}
                  onClick={() => setExamples((current) => current.filter((e) => e.id !== example.id))}>
                  Remove
                </button>
              </div>
            </div>
            <Input label="Target language text" value={example.text}
              onChange={(e) => patch(example.id, { text: e.target.value })} />
            <Input label="Translation" value={example.translation}
              onChange={(e) => patch(example.id, { translation: e.target.value })} />
            <Input label="Audio path" value={example.audio ?? ""} readOnly
              placeholder="No audio generated" />
            <div className="flex gap-2">
              <Button type="button" disabled={saving || !!generatingId || !example.text.trim()}
                onClick={() => void generate(example)}>
                {generatingId === example.id ? "Generating..." : "Generate Audio"}
              </Button>
              <Button type="button" disabled={!example.audio || saving}
                onClick={() => example.audio && void onPlayAudio(example.audio)}>
                Play
              </Button>
            </div>
          </section>
        ))}
        <Button type="button" disabled={saving || !!generatingId} onClick={add}>
          Add Example
        </Button>
        {error && <p role="alert" className="text-sm text-rosewood-accent">{error}</p>}
      </div>
      <div className="border-t border-dashed border-rosewood-ink/30 p-4">
        <Button type="submit" disabled={!dirty || !valid || saving || !!generatingId}>
          {saving ? "Saving..." : "Save Examples"}
        </Button>
      </div>
    </form>
  );
}
