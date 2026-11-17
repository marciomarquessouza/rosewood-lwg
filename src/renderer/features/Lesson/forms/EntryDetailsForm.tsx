import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../../components/Button";
import { Checkbox } from "../../../components/Checkbox";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { TextArea } from "../../../components/TextArea";
import {
  LESSON_STEPS,
  type LessonEntry,
  type LessonEntryType,
  type LessonStepType,
} from "../../../../schemas/lesson";

export type EntryDetails = {
  target: string;
  type: LessonEntryType;
  concept: string;
  description: string;
  enabledSteps: LessonStepType[];
};

interface Props {
  entry: LessonEntry;
  concept?: string;
  description?: string;
  locale: string;
  saving: boolean;
  onSave: (details: EntryDetails) => Promise<void>;
}

export function EntryDetailsForm({ entry, concept, description, locale, saving, onSave }: Props) {
  const initial = (): EntryDetails => ({
    target: entry.target,
    type: entry.type ?? "vocabulary",
    concept: concept ?? "",
    description: description ?? "",
    enabledSteps: entry.enabledSteps ?? [...LESSON_STEPS],
  });
  const [value, setValue] = useState<EntryDetails>(initial);
  useEffect(() => { setValue(initial()); }, [entry, concept, description, locale]);
  const dirty = JSON.stringify(value) !== JSON.stringify(initial());
  const valid = !!value.target.trim();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!dirty || !valid || saving) return;
    await onSave({
      ...value,
      target: value.target.trim(),
      concept: value.concept.trim(),
      description: value.description.trim(),
    });
  };
  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <p className="text-xs text-rosewood-ink/60">Locale: {locale}</p>
        <Input label="Entry name (target)" value={value.target}
          onChange={(e) => setValue((v) => ({ ...v, target: e.target.value }))} />
        <Select label="Type" value={value.type} options={[
          { value: "vocabulary", label: "Vocabulary" },
          { value: "grammar", label: "Grammar" },
        ]} onChange={(e) => setValue((v) => ({
          ...v, type: e.target.value as LessonEntryType,
        }))} />
        <Input label="Concept" value={value.concept}
          onChange={(e) => setValue((v) => ({ ...v, concept: e.target.value }))} />
        <TextArea label="Description" value={value.description}
          onChange={(e) => setValue((v) => ({ ...v, description: e.target.value }))} />
        <fieldset className="space-y-3">
          <legend className="font-bold">Enabled learning steps</legend>
          <p className="text-xs text-rosewood-ink/60">
            Saved as metadata only; gameplay does not yet interpret disabled steps.
          </p>
          {LESSON_STEPS.map((step) => (
            <Checkbox key={step} label={step} checked={value.enabledSteps.includes(step)}
              onChange={(e) => setValue((v) => ({
                ...v,
                enabledSteps: e.target.checked
                  ? LESSON_STEPS.filter((s) => s === step || v.enabledSteps.includes(s))
                  : v.enabledSteps.filter((s) => s !== step),
              }))} />
          ))}
        </fieldset>
      </div>
      <div className="border-t border-dashed border-rosewood-ink/30 p-4">
        <Button type="submit" disabled={!valid || !dirty || saving}>
          {saving ? "Saving..." : "Save Details"}
        </Button>
      </div>
    </form>
  );
}
