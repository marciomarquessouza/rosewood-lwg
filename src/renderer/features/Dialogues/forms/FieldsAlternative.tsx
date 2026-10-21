import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

type Alternative = {
  id: string;
  text: string;
};

type AlternativeFieldsProps = {
  alternatives: Alternative[];
  onChange: (alternatives: Alternative[]) => void;
};

export function AlternativeFields({
  alternatives,
  onChange,
}: AlternativeFieldsProps) {
  const handleAdd = () => {
    onChange([
      ...alternatives,
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof Alternative,
    value: string,
  ) => {
    onChange(
      alternatives.map((alternative, currentIndex) =>
        currentIndex === index
          ? { ...alternative, [field]: value }
          : alternative,
      ),
    );
  };

  const handleRemove = (index: number) => {
    onChange(alternatives.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
          Alternatives
        </h3>

        <p className="text-xs text-rosewood-ink/50">
          Define the available dialogue alternatives.
        </p>
      </div>

      {alternatives.length > 0 ? (
        <div className="space-y-3">
          {alternatives.map((alternative, index) => (
            <div
              key={alternative.id}
              className="space-y-4 rounded-lg border border-rosewood-ink/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood-ink/50">
                  Alternative {index + 1}
                </span>

                <Button
                  type="button"
                  variant="light"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>

              <Input
                label="ID"
                placeholder="Alternative ID"
                value={alternative.id}
                onChange={(event) =>
                  handleChange(index, "id", event.target.value)
                }
              />

              <Input
                label="Text"
                placeholder="Enter alternative text..."
                value={alternative.text}
                onChange={(event) =>
                  handleChange(index, "text", event.target.value)
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-rosewood-ink/15 px-4 py-5 text-center">
          <p className="text-xs text-rosewood-ink/40">
            No alternatives added yet.
          </p>
        </div>
      )}

      <Button type="button" onClick={handleAdd}>
        Add Alternative
      </Button>
    </section>
  );
}
