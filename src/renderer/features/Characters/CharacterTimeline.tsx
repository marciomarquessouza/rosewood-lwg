import { useState } from "react";
import {
  Baby,
  BookOpen,
  BriefcaseBusiness,
  Heart,
  Landmark,
  Plus,
  Skull,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { CharacterTimelineEntry, CharacterTimelineType } from "../../../schemas/characterProfile";

const TYPES: Record<CharacterTimelineType, { label: string; color: string; Icon: typeof Baby }> = {
  birth: { label: "Birth", color: "text-emerald-700", Icon: Baby },
  education: { label: "Education", color: "text-blue-700", Icon: BookOpen },
  career: { label: "Career", color: "text-amber-700", Icon: BriefcaseBusiness },
  relationship: { label: "Relationship", color: "text-pink-700", Icon: Heart },
  loss: { label: "Loss", color: "text-slate-600", Icon: Skull },
  milestone: { label: "Milestone", color: "text-rosewood-accent", Icon: Sparkles },
  other: { label: "Other", color: "text-rosewood-ink", Icon: Landmark },
};

const emptyEntry = (): CharacterTimelineEntry => ({
  id: crypto.randomUUID(),
  date: "",
  title: "",
  description: "",
  type: "milestone",
});

interface CharacterTimelineProps {
  entries: CharacterTimelineEntry[];
  onChange: (entries: CharacterTimelineEntry[]) => void;
  disabled?: boolean;
}

export function CharacterTimeline({ entries, onChange, disabled = false }: CharacterTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CharacterTimelineEntry | null>(null);
  const [error, setError] = useState("");

  const beginAdd = () => {
    setDraft(emptyEntry());
    setEditingId(null);
    setError("");
  };

  const beginEdit = (entry: CharacterTimelineEntry) => {
    setDraft({ ...entry });
    setEditingId(entry.id);
    setError("");
  };

  const save = () => {
    if (!draft) return;
    if (!draft.date.trim() || !draft.title.trim()) {
      setError("Date and title are required.");
      return;
    }
    const next = { ...draft, date: draft.date.trim(), title: draft.title.trim(), description: draft.description.trim() };
    onChange(editingId ? entries.map((entry) => entry.id === editingId ? next : entry) : [...entries, next]);
    setDraft(null);
    setEditingId(null);
    setError("");
  };

  const remove = (id: string) => {
    onChange(entries.filter((entry) => entry.id !== id));
    if (editingId === id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  return (
    <aside className="flex min-h-0 w-full flex-col overflow-hidden border-t-2 border-rosewood-ink/15 bg-rosewood-surface/40 px-2 pt-6 xl:h-full xl:w-[320px] xl:shrink-0 xl:border-l-2 xl:border-t-0 xl:pl-6 xl:pr-2 xl:pt-3" aria-label="Character timeline">
      <div className="mb-5 flex shrink-0 items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-rosewood-ink">Timeline</h2>
          <p className="mt-1 text-xs text-rosewood-ink/60">{entries.length} {entries.length === 1 ? "event" : "events"} in this character's history</p>
        </div>
        <button type="button" disabled={disabled || draft !== null} onClick={beginAdd} aria-label="Add timeline event"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-rosewood-ink bg-rosewood-accent text-white shadow-[3px_3px_0_var(--color-rosewood-ink)] disabled:opacity-50">
          <Plus size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
        {entries.length === 0 && !draft && (
          <div className="rounded-md border-2 border-dashed border-rosewood-ink/25 px-4 py-8 text-center text-sm text-rosewood-ink/60">
            No events yet. Add an event to start the character's story.
          </div>
        )}

        <ol className="relative ml-4 border-l-2 border-rosewood-ink/20">
          {entries.map((entry) => {
            const { Icon, label, color } = TYPES[entry.type];
            return (
              <li key={entry.id} className="group relative mb-7 pl-6 last:mb-2">
                <span className={`absolute -left-[13px] top-0 flex size-6 items-center justify-center rounded-full border-2 border-rosewood-ink bg-white ${color}`}>
                  <Icon size={13} strokeWidth={2.3} />
                </span>
                <div className="flex items-start justify-between gap-1">
                  <button type="button" disabled={disabled} onClick={() => beginEdit(entry)} className="min-w-0 text-left disabled:cursor-default">
                    <span className="block text-xs font-bold text-rosewood-accent">{entry.date}</span>
                    <span className="mt-1 block font-bold leading-snug text-rosewood-ink group-hover:underline">{entry.title}</span>
                  </button>
                  <button type="button" disabled={disabled} aria-label={`Remove ${entry.title}`} onClick={() => remove(entry.id)}
                    className="shrink-0 rounded p-1 text-rosewood-ink/40 opacity-0 transition-opacity hover:text-rosewood-accent focus:opacity-100 group-hover:opacity-100 disabled:hidden">
                    <Trash2 size={15} />
                  </button>
                </div>
                <span className={`mt-1 inline-block text-[11px] font-semibold ${color}`}>{label}</span>
                {entry.description && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-rosewood-ink/75">{entry.description}</p>}
              </li>
            );
          })}
        </ol>

        {draft && (
          <div className="mt-4 rounded-lg border-2 border-rosewood-ink bg-white p-3 shadow-[4px_4px_0_var(--color-rosewood-ink)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-bold">{editingId ? "Edit event" : "New event"}</h3>
              <button type="button" onClick={() => setDraft(null)} aria-label="Cancel editing"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold">Date
                <input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} placeholder="e.g. 1928, Winter 1943" maxLength={80}
                  className="mt-1 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent" />
              </label>
              <label className="block text-xs font-bold">Title
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="What happened?" maxLength={160}
                  className="mt-1 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent" />
              </label>
              <label className="block text-xs font-bold">Type
                <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as CharacterTimelineType })}
                  className="mt-1 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent">
                  {Object.entries(TYPES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                </select>
              </label>
              <label className="block text-xs font-bold">Description
                <textarea rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Optional details..."
                  className="mt-1 w-full resize-y rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent" />
              </label>
            </div>
            {error && <p role="alert" className="mt-2 text-xs font-bold text-rosewood-accent">{error}</p>}
            <button type="button" onClick={save} className="mt-3 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-accent px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_var(--color-rosewood-ink)]">
              {editingId ? "Update event" : "Add event"}
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 border-t border-rosewood-ink/15 pt-3 text-xs text-rosewood-ink/50">Events appear in the order added. Save Changes to persist.</p>
    </aside>
  );
}
