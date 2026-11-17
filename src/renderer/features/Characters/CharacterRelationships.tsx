import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type {
  CharacterRelationship,
  CharacterRelationshipType,
} from "../../../schemas/characterProfile";

const RELATIONSHIPS: { value: CharacterRelationshipType; label: string }[] = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "parent", label: "Parent" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "child", label: "Child" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "sibling", label: "Sibling" },
  { value: "partner", label: "Partner" },
  { value: "spouse", label: "Spouse" },
  { value: "grandparent", label: "Grandparent" },
  { value: "grandchild", label: "Grandchild" },
  { value: "aunt", label: "Aunt" },
  { value: "uncle", label: "Uncle" },
  { value: "cousin", label: "Cousin" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
];

const relationshipLabel = (type: CharacterRelationshipType) =>
  RELATIONSHIPS.find((item) => item.value === type)?.label ?? "Other";

type PersonNode = Node<{ name: string; subtitle: string; primary: boolean }, "person">;

function PersonCard({ data }: NodeProps<PersonNode>) {
  return (
    <div
      className={`relative w-[156px] rounded-lg border-2 px-3 py-2 text-center shadow-sm ${data.primary
        ? "border-rosewood-accent bg-rosewood-accent/10"
        : "border-rosewood-ink/50 bg-white"}`}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div className="truncate text-sm font-bold text-rosewood-ink" title={data.name}>
        {data.name}
      </div>
      <div className="truncate text-[11px] text-rosewood-ink/65">{data.subtitle}</div>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}

const nodeTypes = { person: PersonCard };

function defaultPosition(index: number, count: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(count, 1);
  const radius = Math.max(190, count * 35);
  return {
    x: 190 + Math.cos(angle) * radius,
    y: 190 + Math.sin(angle) * radius,
  };
}

type Props = {
  characterName: string;
  entries: CharacterRelationship[];
  onChange: (entries: CharacterRelationship[]) => void;
  disabled?: boolean;
};

export function CharacterRelationships({
  characterName,
  entries,
  onChange,
  disabled = false,
}: Props) {
  const [draft, setDraft] = useState<CharacterRelationship | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const nodes = useMemo<PersonNode[]>(() => [
    {
      id: "character",
      type: "person",
      position: { x: 190, y: 190 },
      data: { name: characterName || "New character", subtitle: "Current character", primary: true },
      draggable: false,
    },
    ...entries.map((entry, index) => ({
      id: entry.id,
      type: "person" as const,
      position: entry.position ?? defaultPosition(index, entries.length),
      data: { name: entry.name, subtitle: relationshipLabel(entry.type), primary: false },
      draggable: !disabled,
    })),
  ], [characterName, entries, disabled]);

  const [graphNodes, setGraphNodes, onNodesChange] = useNodesState<PersonNode>(nodes);
  useEffect(() => { setGraphNodes(nodes); }, [nodes, setGraphNodes]);

  const edges = useMemo<Edge[]>(() =>
    entries.map((entry) => ({
      id: `relationship-${entry.id}`,
      source: "character",
      target: entry.id,
      type: "smoothstep",
      style: { stroke: "#a64765", strokeWidth: 2 },
    })), [entries]);

  const beginAdd = () => {
    setEditingId(null);
    setError("");
    setDraft({ id: crypto.randomUUID(), name: "", type: "parent", description: "" });
  };

  const beginEdit = (entry: CharacterRelationship) => {
    setEditingId(entry.id);
    setDraft({ ...entry });
    setError("");
  };

  const save = () => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) {
      setError("Name is required.");
      return;
    }
    const next = { ...draft, name, description: draft.description.trim() };
    onChange(editingId
      ? entries.map((entry) => entry.id === editingId ? next : entry)
      : [...entries, next]);
    setDraft(null);
    setEditingId(null);
    setError("");
  };

  const remove = (id: string) => {
    onChange(entries.filter((entry) => entry.id !== id));
    if (editingId === id) setDraft(null);
  };

  return (
    <aside
      className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border-2 border-rosewood-ink/15 bg-rosewood-surface/40 px-4 pb-4 pt-5 xl:h-full xl:w-[320px]"
      aria-label="Character relationships"
    >
      <div className="mb-3 flex shrink-0 items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-rosewood-ink">Family Tree</h2>
          <p className="mt-1 text-xs text-rosewood-ink/60">
            {entries.length} {entries.length === 1 ? "relationship" : "relationships"}
          </p>
        </div>
        <button
          type="button"
          disabled={disabled || draft !== null}
          onClick={beginAdd}
          aria-label="Add relative"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-rosewood-ink bg-rosewood-accent text-white shadow-[3px_3px_0_var(--color-rosewood-ink)] disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="h-[270px] shrink-0 overflow-hidden rounded-lg border border-rosewood-ink/20 bg-white">
        <ReactFlow
          nodes={graphNodes}
          onNodesChange={onNodesChange}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodesConnectable={false}
          elementsSelectable={false}
          onNodeDragStop={(_, node) => {
            if (disabled || node.id === "character") return;
            onChange(entries.map((entry) =>
              entry.id === node.id ? { ...entry, position: node.position } : entry));
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <p className="mt-2 text-[11px] text-rosewood-ink/60">
        Drag relatives to reposition. Zoom or pan to explore.
      </p>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-2 flex items-start gap-2 rounded-md border border-rosewood-ink/15 bg-white/70 p-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-rosewood-ink">{entry.name}</p>
              <p className="text-xs text-rosewood-accent">{relationshipLabel(entry.type)}</p>
              {entry.description && (
                <p className="mt-1 whitespace-pre-wrap text-xs text-rosewood-ink/70">{entry.description}</p>
              )}
            </div>
            <button type="button" disabled={disabled} onClick={() => beginEdit(entry)} aria-label={`Edit ${entry.name}`} className="p-1 disabled:opacity-40">
              <Pencil size={15} />
            </button>
            <button type="button" disabled={disabled} onClick={() => remove(entry.id)} aria-label={`Remove ${entry.name}`} className="p-1 disabled:opacity-40">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {entries.length === 0 && !draft && (
          <p className="py-3 text-center text-xs text-rosewood-ink/60">No relatives yet.</p>
        )}
        {draft && (
          <div className="rounded-lg border-2 border-rosewood-ink bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">{editingId ? "Edit relative" : "Add relative"}</h3>
              <button type="button" aria-label="Cancel" onClick={() => setDraft(null)}><X size={18} /></button>
            </div>
            <label className="mb-3 block text-xs font-bold">
              Name
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                maxLength={160}
                className="mt-1 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent"
              />
            </label>
            <label className="mb-3 block text-xs font-bold">
              Relationship
              <select
                value={draft.type}
                onChange={(event) => setDraft({ ...draft, type: event.target.value as CharacterRelationshipType })}
                className="mt-1 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent"
              >
                {RELATIONSHIPS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold">
              Description (optional)
              <textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                rows={2}
                className="mt-1 w-full resize-y rounded-md border-2 border-rosewood-ink bg-rosewood-surface px-2 py-2 text-sm font-normal outline-none focus:border-rosewood-accent"
              />
            </label>
            {error && <p role="alert" className="mt-2 text-xs text-rosewood-accent">{error}</p>}
            <button
              type="button"
              onClick={save}
              className="mt-3 w-full rounded-md border-2 border-rosewood-ink bg-rosewood-accent px-3 py-2 text-sm font-bold text-white"
            >
              {editingId ? "Update relative" : "Add relative"}
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 border-t border-rosewood-ink/15 pt-3 text-xs text-rosewood-ink/50">
        Save Changes to persist relationships.
      </p>
    </aside>
  );
}
