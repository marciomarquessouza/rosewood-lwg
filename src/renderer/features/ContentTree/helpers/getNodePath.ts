import { ProjectTreeNode } from "./buildProjectTreeNodes";

export function getNodePath(node: ProjectTreeNode): string | null {
  const { type, id } = node;

  if (type === "game-design") return "/game-design";
  if (type === "game-design-category") return "/game-design";
  if (type === "game-design-document") return `/${id}`;
  if (type === "root") return "/";
  if (type === "characters") return "/characters";
  if (type === "character")
    return `/characters/${encodeURIComponent(id.slice("characters/".length))}`;

  const [language, level, , day] = id.split("/");

  switch (type) {
    case "lessons":
      return "/project";

    case "language":
      return `/project/language/${language}`;

    case "level":
      return `/project/${encodeURIComponent(language)}/${encodeURIComponent(level)}/days`;

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
