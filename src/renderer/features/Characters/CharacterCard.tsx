import { ArrowUpRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CharacterProfile } from "../../../schemas/characterProfile";

interface CharacterCardProps {
  character: CharacterProfile;
}

function summarize(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate();
  const name = character.displayName.trim() || character.name;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const description = summarize(character.description);

  return (
    <button
      type="button"
      onClick={() => navigate(`/characters/${encodeURIComponent(character.id)}`)}
      className="group flex h-full min-h-56 w-full flex-col overflow-hidden rounded-lg border-2 border-rosewood-ink bg-rosewood-surface text-left shadow-[5px_5px_0_var(--color-rosewood-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosewood-accent"
      aria-label={`Edit ${name}`}
    >
      <div className="flex w-full items-start justify-between gap-3 border-b-2 border-rosewood-ink bg-rosewood-paper p-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-rosewood-ink bg-rosewood-surface text-xl font-bold text-rosewood-ink" aria-hidden="true">
          {initials || <UserRound size={26} />}
        </div>
        <ArrowUpRight size={20} className="text-rosewood-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-rosewood-ink">{name}</h3>
        {name !== character.name && (
          <p className="text-sm text-rosewood-ink/70">{character.name}</p>
        )}
        <p className="line-clamp-3 text-sm text-rosewood-ink/80">
          {description || "No description yet."}
        </p>
        <span className="mt-auto pt-3 text-xs font-semibold text-rosewood-accent">
          {character.id}
        </span>
      </div>
    </button>
  );
}
