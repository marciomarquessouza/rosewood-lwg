import { useState, type ReactNode } from "react";
import { ChevronRight, FolderOpen } from "lucide-react";
import { NodeColumnTitle } from "./NodeColumnTitle";
import { canCreateNode } from "./utils/canCreateNode";
import { NodeInlineInput } from "./NodeInlineInput";

export type MillerNode<T extends string = string> = {
  id: string;
  name: string;
  type: T;
  children?: MillerNode<T>[];
};

interface MillerColumnsProps<T extends string> {
  root: MillerNode<T>[];
  className?: string;
  creatableNodeTypes?: T[];
  onSelect?: (node: MillerNode<T>, path: MillerNode<T>[]) => void;
  renderItem?: (node: MillerNode<T>) => ReactNode;
  onCreateNode?: (
    nodeType: T,
    value: string,
    parentPath: MillerNode<T>[],
  ) => void | Promise<void>;
}

export function MillerColumns<T extends string>({
  root,
  className = "",
  onSelect,
  renderItem,
  creatableNodeTypes,
  onCreateNode,
}: MillerColumnsProps<T>) {
  const [path, setPath] = useState<MillerNode<T>[]>([]);

  const columns: MillerNode<T>[][] = [root];

  for (const node of path) {
    if (node.children?.length) {
      columns.push(node.children);
    }
  }

  const handleSelect = (columnIndex: number, node: MillerNode<T>) => {
    const nextPath = [...path.slice(0, columnIndex), node];

    setPath(nextPath);
    onSelect?.(node, nextPath);
  };

  return (
    <div
      className={[
        "flex h-full min-h-0 overflow-x-auto",
        "rounded-md border-2 border-rosewood-ink",
        "bg-rosewood-surface",
        className,
      ].join(" ")}
    >
      {columns.map((items, columnIndex) => (
        <div
          key={columnIndex}
          className={[
            "flex h-full min-h-0 w-64 shrink-0 flex-col",
            "border-r border-dashed border-rosewood-ink/30",
          ].join(" ")}
        >
          <NodeColumnTitle nodes={items} />

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const isSelected = path[columnIndex]?.id === item.id;

                const hasChildren = Boolean(item.children?.length);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(columnIndex, item)}
                    aria-selected={isSelected}
                    className={[
                      "group flex w-full items-center gap-2",
                      "rounded-sm border border-transparent",
                      "px-3 py-2 text-left text-sm",
                      "transition-colors duration-150",
                      "cursor-pointer",
                      "focus-visible:outline-2",
                      "focus-visible:outline-rosewood-accent",
                      isSelected
                        ? [
                            "border-rosewood-accent",
                            "bg-rosewood-accent/10",
                            "font-bold text-rosewood-accent",
                          ].join(" ")
                        : [
                            "text-rosewood-ink",
                            "hover:bg-rosewood-accent/5",
                            "hover:text-rosewood-accent",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <FolderOpen
                      size={16}
                      className={[
                        "shrink-0",
                        isSelected
                          ? "text-rosewood-accent"
                          : "text-rosewood-ink/50",
                      ].join(" ")}
                    />

                    <span className="min-w-0 flex-1 truncate">
                      {renderItem ? renderItem(item) : item.name}
                    </span>

                    {hasChildren && (
                      <ChevronRight
                        size={16}
                        className={[
                          "shrink-0",
                          isSelected
                            ? "text-rosewood-accent"
                            : "text-rosewood-ink/40",
                        ].join(" ")}
                      />
                    )}
                  </button>
                );
              })}
              {canCreateNode(items, creatableNodeTypes) && (
                <NodeInlineInput
                  placeholder={`New ${items[0].type}...`}
                  onSubmit={(value) =>
                    onCreateNode?.(
                      items[0].type,
                      value,
                      path.slice(0, columnIndex),
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
