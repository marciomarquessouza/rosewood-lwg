import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { NodeColumnTitle } from "./NodeColumnTitle";
import { NodeInlineInput } from "./NodeInlineInput";
import { MillerDefaultRow } from "./MillerDefaultRow";
import { getNodeTypeLabel } from "./utils/getNodeTypeLabel";

export type MillerNode<T extends string = string> = {
  id: string;
  name: string;
  type: T;
  children?: MillerNode<T>[];
};

export interface MillerColumnsProps<T extends string> {
  root: MillerNode<T>[];
  className?: string;
  creatableNodeTypes?: T[];
  nodeIcons?: Partial<Record<T, LucideIcon>>;
  onSelect?: (node: MillerNode<T>, path: MillerNode<T>[]) => void;
  renderNode?: (node: MillerNode<T>, isSelected: boolean) => ReactNode;
  isFormNode?: (node: MillerNode<T>) => boolean;
  renderForm?: (node: MillerNode<T>) => ReactNode;
  onCreateNode?: (
    nodeType: T,
    value: string,
    parentPath: MillerNode<T>[],
  ) => void | Promise<void>;
}

type MillerColumn<T extends string> = {
  id: string;
  items: MillerNode<T>[];
  parentPath: MillerNode<T>[];
  nodeType?: T;
};

export function MillerColumns<T extends string>({
  root,
  className = "",
  nodeIcons,
  onSelect,
  renderNode,
  creatableNodeTypes,
  onCreateNode,
  isFormNode,
  renderForm,
}: MillerColumnsProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const columns: MillerColumn<T>[] = [];
  const path: MillerNode<T>[] = [];

  let items = root;

  useLayoutEffect(() => {
    containerRef.current?.scrollTo({
      left: containerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [path]);

  columns.push({
    id: "root",
    items,
    parentPath: [],
    nodeType: items[0]?.type,
  });

  for (const selectedId of selectedIds) {
    const node = items.find((item) => item.id === selectedId);

    if (!node) break;

    path.push(node);
    items = node.children ?? [];

    if (items.length === 0) break;

    columns.push({
      id: node.id,
      items,
      parentPath: [...path],
      nodeType: items[0]?.type,
    });
  }

  const handleSelect = (columnIndex: number, node: MillerNode<T>) => {
    const nextIds = [...selectedIds.slice(0, columnIndex), node.id];

    const nextPath = [...path.slice(0, columnIndex), node];

    setSelectedIds(nextIds);
    onSelect?.(node, nextPath);
  };

  return (
    <div
      ref={containerRef}
      className={[
        "flex h-full min-h-0 overflow-x-auto",
        "rounded-md border-2 border-rosewood-ink",
        "bg-rosewood-surface",
        className,
      ].join(" ")}
    >
      {columns.map((column, columnIndex) => {
        const { items, nodeType, parentPath } = column;
        const parentNode = path[columnIndex - 1];

        const formNode =
          items.length === 1 && isFormNode?.(items[0]) ? items[0] : null;

        if (formNode && renderForm) {
          return (
            <div
              key={column.id}
              className={[
                "flex h-full min-h-0 min-w-80 shrink-0 flex-col",
                "border-r border-dashed border-rosewood-ink/30",
              ].join(" ")}
            >
              <NodeColumnTitle title={formNode.name} />
              {renderForm(parentNode)}
            </div>
          );
        }

        const canCreateNode =
          nodeType !== undefined &&
          Boolean(onCreateNode) &&
          Boolean(creatableNodeTypes?.includes(nodeType));

        return (
          <div
            key={column.id}
            className={[
              "flex h-full min-h-0 w-64 shrink-0 flex-col",
              "border-r border-dashed border-rosewood-ink/30",
            ].join(" ")}
          >
            <NodeColumnTitle
              title={getNodeTypeLabel(items)}
              counter={items.length}
            />

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1">
                {items.map((item) => {
                  const isSelected = selectedIds[columnIndex] === item.id;

                  const hasChildren = Boolean(item.children?.length);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(columnIndex, item)}
                      aria-current={isSelected ? "true" : undefined}
                      className={[
                        "group flex w-full cursor-pointer",
                        "items-center gap-2 rounded-sm",
                        "border border-transparent",
                        "px-3 py-2 text-left text-sm",
                        "transition-colors duration-150",
                        "focus-visible:outline-2",
                        "focus-visible:outline-rosewood-accent",
                        isSelected
                          ? "border-rosewood-accent bg-rosewood-accent/10 font-bold text-rosewood-accent"
                          : "text-rosewood-ink hover:bg-rosewood-accent/5 hover:text-rosewood-accent",
                      ].join(" ")}
                    >
                      {renderNode ? (
                        renderNode(item, isSelected)
                      ) : (
                        <MillerDefaultRow
                          name={item.name}
                          isSelected={isSelected}
                          icon={nodeIcons?.[item.type]}
                        />
                      )}

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

                {canCreateNode && (
                  <NodeInlineInput
                    placeholder={`New ${nodeType}...`}
                    onSubmit={(value) =>
                      onCreateNode?.(nodeType, value, parentPath)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
