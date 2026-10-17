import { SubmitEvent, useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export interface LocaleStepData {
  text: string;
  instruction: string;
  meanings?: string[];
  gender?: string;
}

export interface LocaleStepFormProps {
  locale: string;
  initialValue?: LocaleStepData;
  saving?: boolean;
  onSave: (step: LocaleStepData) => void | Promise<void>;
}

const emptyStep: LocaleStepData = {
  text: "",
  instruction: "",
  meanings: [],
  gender: "",
};

export function LocaleStepForm({
  locale,
  initialValue,
  saving = false,
  onSave,
}: LocaleStepFormProps) {
  const [step, setStep] = useState<LocaleStepData>(initialValue ?? emptyStep);

  useEffect(() => {
    setStep(initialValue ?? emptyStep);
  }, [initialValue, locale]);

  const isDirty =
    JSON.stringify(step) !== JSON.stringify(initialValue ?? emptyStep);

  const isValid =
    step.text.trim().length > 0 && step.instruction.trim().length > 0;

  const updateField = <K extends keyof LocaleStepData>(
    field: K,
    value: LocaleStepData[K],
  ) => {
    setStep((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || !isDirty || saving) return;

    await onSave({
      text: step.text.trim(),
      instruction: step.instruction.trim(),
      meanings: step.meanings?.map((meaning) => meaning.trim()).filter(Boolean),
      gender: step.gender?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Locale Step
          </p>
          <p className="mt-1 text-xs text-rosewood-ink/60">Locale: {locale}</p>
        </div>

        <Input
          label="Text"
          value={step.text}
          onChange={(event) => updateField("text", event.target.value)}
          placeholder="Enter step text..."
        />

        <Input
          label="Instruction"
          value={step.instruction}
          onChange={(event) => updateField("instruction", event.target.value)}
          placeholder="Enter instruction..."
        />

        <Input
          label="Gender"
          value={step.gender ?? ""}
          onChange={(event) => updateField("gender", event.target.value)}
          placeholder="Enter gender..."
        />

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Meanings
          </p>

          {(step.meanings ?? []).map((meaning, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  label={`Meaning ${index + 1}`}
                  value={meaning}
                  onChange={(event) => {
                    const meanings = [...(step.meanings ?? [])];
                    meanings[index] = event.target.value;
                    updateField("meanings", meanings);
                  }}
                  placeholder="Enter meaning..."
                />
              </div>

              <Button
                type="button"
                onClick={() => {
                  updateField(
                    "meanings",
                    (step.meanings ?? []).filter((_, i) => i !== index),
                  );
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              updateField("meanings", [...(step.meanings ?? []), ""])
            }
          >
            Add Meaning
          </Button>
        </div>
      </div>

      <div className="border-t border-dashed border-rosewood-ink/30 p-4">
        <Button type="submit" disabled={!isDirty || !isValid || saving}>
          {saving ? "Saving..." : "Save Step"}
        </Button>
      </div>
    </form>
  );
}
