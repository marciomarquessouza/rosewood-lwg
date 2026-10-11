import { FolderOpen, LucideIcon } from "lucide-react";

interface MillerDefaultRowProps {
  name: string;
  isSelected?: boolean;
  icon?: LucideIcon;
}

export function MillerDefaultRow({
  name,
  isSelected,
  icon: Icon = FolderOpen,
}: MillerDefaultRowProps) {
  return (
    <>
      <Icon
        size={16}
        className={[
          "shrink-0",
          isSelected ? "text-rosewood-accent" : "text-rosewood-ink/50",
        ].join(" ")}
      />
      <span className="min-w-0 flex-1 truncate">{name}</span>
    </>
  );
}
