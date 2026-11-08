import { ProjectTreeNode } from "./buildProjectTreeNodes";

export function getCreatePath(node: ProjectTreeNode): string | null {
  switch (node.type) {
    case "characters":
      return "/characters/new";

    case "root":
      return "/project/new";

    case "lessons":
      return "/project/new";

    case "language":
      return `/project/${node.id}`;

    case "level": {
      const [language, level] = node.id.split("/");
      return `/project/${language}/${level}/days/new`;
    }

    default:
      return null;
  }
}
