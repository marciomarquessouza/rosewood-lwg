import { SubmitEvent, useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export interface LessonTitleFormProps {
  locale: string;
  initialValue?: string;
  saving?: boolean;
  onSave: (title: string) => void | Promise<void>;
}

export function LessonTitleForm({
  locale,
  initialValue = "",
  saving = false,
  onSave,
}: LessonTitleFormProps) {
  const [title, setTitle] = useState(initialValue);

  useEffect(() => {
    setTitle(initialValue);
  }, [initialValue, locale]);

  const isDirty = title !== initialValue;
  const isValid = title.trim().length > 0;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || !isDirty || saving) return;

    await onSave(title.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
            Lesson Title
          </p>
          <p className="mt-1 text-xs text-rosewood-ink/60">Locale: {locale}</p>
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter lesson title..."
        />
      </div>

      <div className="border-t border-dashed border-rosewood-ink/30 p-4">
        <Button type="submit" disabled={!isDirty || !isValid || saving}>
          {saving ? "Saving..." : "Save Title"}
        </Button>
      </div>
    </form>
  );
}
