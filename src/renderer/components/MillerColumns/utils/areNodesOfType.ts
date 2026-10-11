import { MillerNode } from "..";

export function areNodesOfType<T extends string>(
  nodes: MillerNode<T>[],
  expectedType: MillerNode<T>["type"],
): boolean {
  return nodes.length > 0 && nodes.every((node) => node.type === expectedType);
}
