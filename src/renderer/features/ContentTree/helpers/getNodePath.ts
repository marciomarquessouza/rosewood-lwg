import { ProjectTreeNode } from "./buildProjectTreeNodes";

export function getNodePath(node: ProjectTreeNode): string | null {
  const { type, id } = node;

  if (type === "root") return "/";

  const [language, level, , day] = id.split("/");

  switch (type) {
    case "level":
      return `/project/${language}/${level}`;

    case "day":
      return `/project/${language}/${level}/days/${day}`;

    case "lesson":
      return `/project/${language}/${level}/days/${day}/lesson`;

    case "dialogues":
      return `/project/${language}/${level}/days/${day}/dialogues`;

    default:
      return null;
  }
}
