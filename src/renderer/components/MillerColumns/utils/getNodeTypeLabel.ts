import { MillerNode } from "..";

export function getNodeTypeLabel<T extends string>(
  nodes: MillerNode<T>[],
): string {
  const types = new Set(nodes.map((node) => node.type));

  return Array.from(types).join("/");
}
