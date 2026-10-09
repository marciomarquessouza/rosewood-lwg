import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { EntryForm } from "./LessonEntries";

interface EntryFormRowProps {
  form: EntryForm;
  onChange: (form: EntryForm) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EntryFormRow({
  form,
  onChange,
  onSave,
  onCancel,
}: EntryFormRowProps) {
  return (
    <tr className="bg-rosewood-surface/50">
      <td className="px-3 py-3 align-top">
        <Input
          type="number"
          min={0}
          value={form.sequence}
          onChange={(event) =>
            onChange({
              ...form,
              sequence: Number(event.target.value),
            })
          }
        />
      </td>

      <td className="px-3 py-3 align-top">
        <Input
          autoFocus
          value={form.target}
          placeholder="Target"
          onChange={(event) =>
            onChange({
              ...form,
              target: event.target.value,
            })
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSave();
            }

            if (event.key === "Escape") {
              onCancel();
            }
          }}
        />
      </td>

      <td className="px-3 py-3 align-top">
        <div className="flex justify-end gap-2">
          <Button
            variant="accent"
            onClick={onSave}
            disabled={!form.target.trim()}
          >
            Save
          </Button>

          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </td>
    </tr>
  );
}
