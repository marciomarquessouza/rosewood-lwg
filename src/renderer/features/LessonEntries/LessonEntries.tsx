import { useState } from "react";

import { Button } from "../../components/Button";
import { EntryFormRow } from "./EntryFormRow";
import { getNextId } from "./utils/getNextId";

export interface LessonEntry {
  sequence: number;
  target: string;
}

interface LessonEntriesProps {
  entries: Record<string, LessonEntry>;
  onChange: (entries: Record<string, LessonEntry>) => void;
}

export type EntryForm = {
  id: string | null;
  sequence: number;
  target: string;
};

export function LessonEntries({ entries, onChange }: LessonEntriesProps) {
  const [form, setForm] = useState<EntryForm | null>(null);

  const sortedEntries = Object.entries(entries).sort(
    ([, a], [, b]) => a.sequence - b.sequence,
  );

  function handleAdd() {
    setForm({
      id: null,
      sequence: sortedEntries.length,
      target: "",
    });
  }

  function handleEdit(id: string, entry: LessonEntry) {
    setForm({
      id,
      sequence: entry.sequence,
      target: entry.target,
    });
  }

  function handleSave() {
    if (!form || !form.target.trim()) {
      return;
    }

    const id = form.id ?? getNextId(entries);

    onChange({
      ...entries,
      [id]: {
        sequence: form.sequence,
        target: form.target.trim(),
      },
    });

    setForm(null);
  }

  function handleDelete(id: string) {
    const nextEntries = { ...entries };

    delete nextEntries[id];

    const reorderedEntries = Object.fromEntries(
      Object.entries(nextEntries)
        .sort(([, a], [, b]) => a.sequence - b.sequence)
        .map(([entryId, entry], sequence) => [
          entryId,
          {
            ...entry,
            sequence,
          },
        ]),
    );

    onChange(reorderedEntries);

    if (form?.id === id) {
      setForm(null);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-rosewood-ink">Entries</h2>

        <Button variant="light" onClick={handleAdd} disabled={form !== null}>
          Add Entry
        </Button>
      </header>

      <div className="overflow-hidden rounded-md border-2 border-rosewood-ink">
        <table className="w-full border-collapse text-left">
          <thead className="bg-rosewood-surface">
            <tr className="border-b-2 border-rosewood-ink">
              <th className="w-24 px-3 py-2">Order</th>
              <th className="px-3 py-2">Target</th>
              <th className="w-48 px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedEntries.map(([id, entry]) =>
              form?.id === id ? (
                <EntryFormRow
                  key={id}
                  form={form}
                  onChange={setForm}
                  onSave={handleSave}
                  onCancel={() => setForm(null)}
                />
              ) : (
                <tr
                  key={id}
                  className="border-b border-rosewood-ink last:border-b-0"
                >
                  <td className="px-3 py-3 font-bold text-rosewood-accent">
                    {entry.sequence}
                  </td>

                  <td className="px-3 py-3 font-bold text-rosewood-ink">
                    {entry.target}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="light"
                        onClick={() => handleEdit(id, entry)}
                        disabled={form !== null}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="accent"
                        onClick={() => handleDelete(id)}
                        disabled={form !== null}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ),
            )}

            {form?.id === null && (
              <EntryFormRow
                form={form}
                onChange={setForm}
                onSave={handleSave}
                onCancel={() => setForm(null)}
              />
            )}

            {!sortedEntries.length && !form && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-6 text-center text-rosewood-ink/60"
                >
                  No entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
