import { useNavigate } from "react-router-dom";
import type { CharacterProfile } from "../../../schemas/characterProfile";
import { ProfileCard } from "../../components/ProfileCard";

interface CharacterCardProps {
  character: CharacterProfile;
  index?: number;
}

function summarize(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function CharacterCard({ character, index }: CharacterCardProps) {
  const navigate = useNavigate();

  const name = character.displayName?.trim() || character.name;

  return (
    <ProfileCard
      title={name}
      subtitle={name !== character.name ? character.name : undefined}
      description={summarize(character.description)}
      identifier={character.id}
      index={index}
      label="CHARACTER"
      actionLabel="View profile"
      onClick={() =>
        navigate(`/characters/${encodeURIComponent(character.id)}`)
      }
    />
  );
}
