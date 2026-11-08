import { useState } from "react";
import { UserRound } from "lucide-react";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "circle" | "square";

interface AvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

const sizes: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-12 text-base",
  lg: "size-16 text-xl",
  xl: "size-24 text-4xl",
};

const shapes: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-lg",
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function Avatar({
  name = "",
  src,
  alt,
  size = "lg",
  shape = "circle",
  className = "",
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const initials = getInitials(name);
  const showImage = Boolean(src && failedSrc !== src);

  return (
    <div
      className={[
        "relative flex shrink-0 items-center justify-center",
        "overflow-hidden border-2 border-rosewood-ink",
        "bg-rosewood-surface text-rosewood-ink",
        "shadow-[4px_4px_0_var(--color-rosewood-ink)]",
        sizes[size],
        shapes[shape],
        className,
      ].join(" ")}
    >
      {showImage ? (
        <img
          key={src}
          src={src}
          alt={alt ?? name}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : initials ? (
        <span className="font-serif font-bold tracking-tight">{initials}</span>
      ) : (
        <UserRound size="45%" strokeWidth={1.5} aria-hidden="true" />
      )}
    </div>
  );
}
