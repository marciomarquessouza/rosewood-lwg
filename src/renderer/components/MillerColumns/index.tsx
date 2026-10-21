import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { NodeColumnTitle } from "./NodeColumnTitle";
import { MillerDefaultRow } from "./MillerDefaultRow";
import { getNodeTypeLabel } from "./utils/getNodeTypeLabel";
import { MillerInlineEditor } from "./MillerInlineEditor";

export type MillerNode<T extends string = string> = {
  id: string;
  name: string;
  type: T;
  children?: MillerNode<T>[];
  childrenTitle?: string;
};

export type SelectedNode<T extends string> = {
  node: MillerNode<T>;
  path: MillerNode<T>[];
  selectedIds: string[];
};

type EditingNode = {
  mode: "create" | "edit";
  nodeId: string;
};

export type NodeActionTypes = "create" | "edit" | "remove";

export type MillerNodeAction<T extends string> = {
  type: NodeActionTypes;
  node: MillerNode<T>;
  path: MillerNode<T>[];
  selectedIds: string[];
  value?: string;
};

export interface MillerColumnsProps<T extends string> {
  root: MillerNode<T>[];
  className?: string;
  nodeIcons?: Partial<Record<T, LucideIcon>>;
  onSelect?: (selection: SelectedNode<T>) => void;
  renderNode?: (node: MillerNode<T>, isSelected: boolean) => ReactNode;
  isFormNode?: (node: MillerNode<T>) => boolean;
  renderForm?: (
    node: MillerNode<T>,
    selectedIds: string[],
    path: MillerNode<T>[],
  ) => ReactNode;
  getNodeActions?: (node: MillerNode<T>) => NodeActionTypes[];
  onNodeAction?: (action: MillerNodeAction<T>) => void | Promise<void>;
  requiresCreateInput?: (node: MillerNode<T>) => boolean;
}

type MillerColumn<T extends string> = {
  id: string;
  items: MillerNode<T>[];
  parentPath: MillerNode<T>[];
};

export function MillerColumns<T extends string>({
  root,
  className = "",
  nodeIcons,
  onSelect,
  renderNode,
  isFormNode,
  renderForm,
  getNodeActions,
  onNodeAction,
  requiresCreateInput,
}: MillerColumnsProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const columns: MillerColumn<T>[] = [];
  const path: MillerNode<T>[] = [];

  let items = root;

  columns.push({
    id: "root",
    items,
    parentPath: [],
  });

  for (const selectedId of selectedIds) {
    const node = items.find((item) => item.id === selectedId);

    if (!node) break;

    path.push(node);
    items = node.children ?? [];

    const canCreate = getNodeActions?.(node).includes("create") ?? false;

    if (items.length === 0 && !canCreate) break;

    columns.push({
      id: node.id,
      items,
      parentPath: [...path],
    });
  }

  useLayoutEffect(() => {
    containerRef.current?.scrollTo({
      left: containerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [selectedIds]);

  const handleSelect = (columnIndex: number, node: MillerNode<T>) => {
    const nextIds = [...selectedIds.slice(0, columnIndex), node.id];
    const nextPath = [...path.slice(0, columnIndex), node];

    setSelectedIds(nextIds);
    onSelect?.({ node, path: nextPath, selectedIds: nextIds });
  };

  const handleNodeAction = async (
    type: NodeActionTypes,
    node: MillerNode<T>,
    parentPath: MillerNode<T>[],
    value?: string,
  ) => {
    await onNodeAction?.({
      type,
      node,
      path: [...parentPath, node],
      selectedIds,
      value,
    });
  };

  const handleStartEditing = (
    mode: EditingNode["mode"],
    node: MillerNode<T>,
  ) => {
    if (mode === "create" && requiresCreateInput?.(node) === false) {
      const parentPath = path.slice(0, -1);

      void handleNodeAction("create", node, parentPath);
      return;
    }
    setEditingNode({
      mode,
      nodeId: node.id,
    });
  };

  const handleCancelEditing = () => {
    setEditingNode(null);
  };

  const handleSubmitEditing = async (
    node: MillerNode<T>,
    parentPath: MillerNode<T>[],
    value: string,
  ) => {
    if (!editingNode) return;

    await handleNodeAction(editingNode.mode, node, parentPath, value);

    setEditingNode(null);
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
        const { items, parentPath } = column;
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
              {renderForm(parentNode, selectedIds, path)}
            </div>
          );
        }

        // Creation belongs to the parent of the current column.
        const canCreate =
          parentNode && getNodeActions?.(parentNode).includes("create");

        return (
          <div
            key={column.id}
            className={[
              "flex h-full min-h-0 w-64 shrink-0 flex-col",
              "border-r border-dashed border-rosewood-ink/30",
            ].join(" ")}
          >
            <NodeColumnTitle
              title={
                parentNode?.childrenTitle ??
                (items.length > 0
                  ? getNodeTypeLabel(items)
                  : (parentNode?.name ?? ""))
              }
              counter={items.length}
            />

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1">
                {items.map((item) => {
                  const isSelected = selectedIds[columnIndex] === item.id;
                  const hasChildren = Boolean(item.children?.length);

                  const actions = getNodeActions?.(item) ?? [];
                  const canEdit = actions.includes("edit");
                  const canRemove = actions.includes("remove");
                  const isEditing =
                    editingNode?.mode === "edit" &&
                    editingNode.nodeId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="group relative flex items-center"
                    >
                      {isEditing ? (
                        <div className="w-full px-1 py-1">
                          <MillerInlineEditor
                            initialValue={item.name}
                            placeholder="Enter name..."
                            onSubmit={(value) =>
                              handleSubmitEditing(item, parentPath, value)
                            }
                            onCancel={handleCancelEditing}
                          />
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSelect(columnIndex, item)}
                            aria-current={isSelected ? "true" : undefined}
                            className={[
                              "flex w-full min-w-0 cursor-pointer",
                              "items-center gap-2 rounded-sm",
                              "border border-transparent",
                              "px-3 py-2 text-left text-sm",
                              "transition-colors duration-150",
                              "focus-visible:outline-2",
                              "focus-visible:outline-rosewood-accent",
                              canEdit || canRemove ? "pr-16" : "",
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
                                  "ml-auto shrink-0",
                                  isSelected
                                    ? "text-rosewood-accent"
                                    : "text-rosewood-ink/40",
                                ].join(" ")}
                              />
                            )}
                          </button>

                          {(canEdit || canRemove) && (
                            <div
                              className={[
                                "absolute right-2 flex items-center gap-1",
                                "opacity-0 transition-opacity",
                                "group-hover:opacity-100",
                                "group-focus-within:opacity-100",
                              ].join(" ")}
                            >
                              {canEdit && (
                                <button
                                  type="button"
                                  aria-label={`Edit ${item.name}`}
                                  title="Edit"
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() =>
                                    handleStartEditing("edit", item)
                                  }
                                  className={[
                                    "rounded-sm p-1",
                                    "text-rosewood-ink/50",
                                    "hover:bg-rosewood-accent/10",
                                    "hover:text-rosewood-accent",
                                    "focus-visible:outline-2",
                                    "focus-visible:outline-rosewood-accent",
                                  ].join(" ")}
                                >
                                  <Pencil size={14} />
                                </button>
                              )}

                              {canRemove && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${item.name}`}
                                  title="Remove"
                                  onClick={() =>
                                    void handleNodeAction(
                                      "remove",
                                      item,
                                      parentPath,
                                    )
                                  }
                                  className={[
                                    "rounded-sm p-1",
                                    "text-rosewood-ink/50",
                                    "hover:bg-red-500/10 hover:text-red-600",
                                    "focus-visible:outline-2",
                                    "focus-visible:outline-red-600",
                                  ].join(" ")}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}

                {canCreate &&
                  (editingNode?.mode === "create" &&
                  editingNode.nodeId === parentNode.id ? (
                    <div className="px-1 py-1">
                      <MillerInlineEditor
                        placeholder="New entry..."
                        onSubmit={(value) =>
                          handleSubmitEditing(
                            parentNode,
                            parentPath.slice(0, -1),
                            value,
                          )
                        }
                        onCancel={handleCancelEditing}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEditing("create", parentNode)}
                      className={[
                        "flex w-full items-center gap-2",
                        "rounded-sm border border-dashed",
                        "border-rosewood-ink/20 px-3 py-2",
                        "text-left text-sm text-rosewood-ink/40",
                        "transition-colors",
                        "hover:border-rosewood-accent",
                        "hover:bg-rosewood-accent/5",
                        "hover:text-rosewood-accent",
                        "focus-visible:outline-2",
                        "focus-visible:outline-rosewood-accent",
                      ].join(" ")}
                    >
                      <Plus size={16} />
                      <span>Add new...</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
