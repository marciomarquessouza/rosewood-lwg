import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export function DialogueFields() {
  return null;
}

type AlternativeFieldsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AlternativeFields({ value, onChange }: AlternativeFieldsProps) {
  const addAlternative = () => {
    try {
      const current = JSON.parse(value);
      if (!Array.isArray(current)) return;
      onChange(JSON.stringify([...current, {}], null, 2));
    } catch {
      // Keep current input until JSON is corrected.
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
        Alternatives
      </p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        className="w-full rounded border border-rosewood-ink/30 bg-white p-3 font-mono text-xs"
        placeholder="[]"
      />

      <Button type="button" onClick={addAlternative}>
        Add Alternative
      </Button>
    </div>
  );
}

type InputFieldsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InputFields({ value, onChange }: InputFieldsProps) {
  return (
    <Input
      label="Input Label"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Enter input label..."
    />
  );
}
