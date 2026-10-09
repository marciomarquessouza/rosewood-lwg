import { ContentTreeNode } from "../ContentNode";

export function getNodePath(node: ContentTreeNode): string | null {
  const { type, id } = node;

  if (type === "root") return "/";

  const [language, level, , day] = id.split("/");

  switch (type) {
    case "level":
      return `/project/${language}/${level}`;

    case "day":
      return `/project/${language}/${level}/days/${day}`;

    case "lesson":
      return `/days/${language}/${level}/${day}/lesson`;

    case "dialogues":
      return `/days/${language}/${level}/${day}/dialogues`;

    default:
      return null;
  }
}
