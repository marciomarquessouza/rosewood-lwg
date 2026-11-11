import { ProjectContentLines } from "../../../../shared/project";

type ProjectNodeType =
  | "root"
  | "characters"
  | "character"
  | "language"
  | "level"
  | "day"
  | "lessons"
  | "lesson"
  | "dialogues";

export interface ProjectTreeNode {
  id: string;
  name: string;
  type: ProjectNodeType;
  children?: ProjectTreeNode[];
}

export function buildProjectTreeNodes(
  data: ProjectContentLines,
): ProjectTreeNode[] {
  const languages = new Map<string, ProjectTreeNode>();

  for (const { language, level, days } of data.lines) {
    let languageNode = languages.get(language);

    if (!languageNode) {
      languageNode = {
        id: language,
        name: language,
        type: "language",
        children: [],
      };

      languages.set(language, languageNode);
    }

    const levelId = `${language}/${level}`;

    const levelNode: ProjectTreeNode = {
      id: levelId,
      name: level,
      type: "level",
      children: days.map(({ directory, files }) => {
        const dayId = `${levelId}/days/${directory}`;

        return {
          id: dayId,
          name: directory,
          type: "day",
          children: files
            .filter((file) => file !== "meta.json")
            .map((file) => {
              const name = file.replace(/\.json$/i, "");
              return {
                id: `${dayId}/${file}`,
                name,
                type: name === "lesson" ? "lesson" : "dialogues",
              };
            }),
        };
      }),
    };

    languageNode.children?.push(levelNode);
  }

  return [
    {
      id: "root",
      name: "Content",
      type: "root",
      children: [
        {
          id: "characters",
          name: "Characters",
          type: "characters",
          children: data.characters.map((character) => ({
            id: `characters/${character.id}`,
            name: `${character.displayName} [${character.id}]`,
            type: "character" as const,
          })),
        },
        {
          id: "lesson",
          name: "Lessons",
          children: Array.from(languages.values()),
          type: "lessons" as const,
        },
      ],
    },
  ];
}
