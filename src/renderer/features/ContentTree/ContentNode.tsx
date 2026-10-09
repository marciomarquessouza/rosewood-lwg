import { NodeRendererProps } from "react-arborist";
import { useLocation, useNavigate } from "react-router-dom";
import { getCreatePath } from "./helpers/getCreatePath";
import { BookOpen, ChevronDown, ChevronRight, Folder, FolderOpen, Globe2, GraduationCap, LayoutDashboard, MessageSquare, Plus } from "lucide-react";
import { getNodePath } from "./helpers/getNodePath";
import { ProjectTreeNode } from "./helpers/buildProjectTreeNodes";

export function ContentNode({ node, style }: NodeRendererProps<ProjectTreeNode>) {
  const navigate = useNavigate();
  const location = useLocation();
  const createPath = getCreatePath(node.data);

  const { type, name } = node.data;

  const Icon = NODE_ICONS[type];
  const path = getNodePath(node.data);

  const isActive = path !== null && location.pathname === path;
  const isExpandable = !node.isLeaf;

  const handleClick = () => {
    if (isExpandable) {
      node.toggle();
    }

    if (path) {
      navigate(path);
    }
  };

  return (
    <div style={style} className="flex items-center pr-2">
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={isExpandable ? node.isOpen : undefined}
        aria-current={isActive ? "page" : undefined}
        className={[
          "group flex h-8 w-full items-center gap-2",
          "rounded px-2 text-left text-sm",
          "transition-colors duration-150",
          "focus-visible:outline-2",
          "focus-visible:outline-rosewood-accent",
          isActive
            ? "bg-rosewood-accent/10 font-bold text-rosewood-accent"
            : "text-rosewood-ink hover:bg-rosewood-ink/5",
        ].join(" ")}
      >
        <span className="flex size-3 shrink-0 items-center justify-center">
          {isExpandable &&
            (node.isOpen ? (
              <ChevronDown size={13} />
            ) : (
              <ChevronRight size={13} />
            ))}
        </span>

        {type === "day" && node.isOpen ? (
          <FolderOpen size={16} className="text-rosewood-accent" />
        ) : (
          <Icon
            size={16}
            className={
              isActive ? "text-rosewood-accent" : "text-rosewood-ink/60"
            }
          />
        )}

        <span className="min-w-0 truncate">{name}</span>
        {createPath && (
          <button
            type="button"
            title={`Add child to ${node.data.name}`}
            aria-label={`Add child to ${node.data.name}`}
            onClick={(event) => {
              event.stopPropagation();
              navigate(createPath);
            }}
            className={[
              "ml-auto flex size-6 items-center justify-center",
              "rounded text-rosewood-ink/60",
              "opacity-0 transition-all",
              "hover:bg-rosewood-accent/10",
              "hover:text-rosewood-accent",
              "group-hover:opacity-100",
              "focus-visible:opacity-100",
            ].join(" ")}
          >
            <Plus size={15} />
          </button>
        )}
      </button>
    </div>
  );
}

const NODE_ICONS = {
  root: LayoutDashboard,
  language: Globe2,
  level: GraduationCap,
  day: Folder,
  lesson: BookOpen,
  dialogues: MessageSquare,
} as const;