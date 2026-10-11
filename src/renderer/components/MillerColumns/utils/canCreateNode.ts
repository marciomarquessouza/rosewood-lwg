import { MillerNode } from "..";

export function canCreateNode<T extends string>(
  nodes: MillerNode<T>[],
  creatableNodeTypes: T[] = [],
) {
  const nodeType = nodes[0]?.type;
  return nodeType !== undefined && creatableNodeTypes?.includes(nodeType);
}
