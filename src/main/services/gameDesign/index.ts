import fs from "node:fs/promises";
import path from "node:path";
import { openProject } from "../project/openProject";
import { GAME_DESIGN_CATEGORIES, type GameDesignCategory, type GameDesignDocument } from "../../../shared/gameDesign";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validateCategory = (value: string): GameDesignCategory => {
  if (!GAME_DESIGN_CATEGORIES.includes(value as GameDesignCategory)) throw new Error("Invalid game design category");
  return value as GameDesignCategory;
};
const validateSlug = (slug: string) => {
  if (!slugPattern.test(slug)) throw new Error("Invalid document slug");
  return slug;
};
const documentPath = (base: string, category: GameDesignCategory, slug: string) =>
  path.join(base, "game-design", validateCategory(category), validateSlug(slug) + ".md");

function serialize(document: GameDesignDocument): string {
  // JSON-quoted values are valid YAML strings and require no YAML dependency.
  return `---
title: ${JSON.stringify(document.title)}
description: ${JSON.stringify(document.description)}
---

${document.content.trimEnd()}
`;
}
function parse(source: string, category: GameDesignCategory, slug: string): GameDesignDocument {
  const match = source.match(/^---\r?\n(title: .*)\r?\n(description: .*)\r?\n---\r?\n(?:\r?\n)?/);
  if (!match) throw new Error(`Invalid frontmatter: ${category}/${slug}`);
  const title = JSON.parse(match[1].slice("title: ".length));
  const description = JSON.parse(match[2].slice("description: ".length));
  if (typeof title !== "string" || typeof description !== "string") throw new Error("Invalid document metadata");
  return { category, slug, title, description, content: source.slice(match[0].length) };
}
export async function getGameDesignDocuments(projectPath: string): Promise<GameDesignDocument[]> {
  const { contentPath } = await openProject(projectPath);
  const documents: GameDesignDocument[] = [];
  for (const category of GAME_DESIGN_CATEGORIES) {
    const directory = path.join(contentPath, "game-design", category);
    let names: string[];
    try { names = await fs.readdir(directory); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
    for (const name of names.filter((name) => name.endsWith(".md"))) {
      const slug = validateSlug(name.slice(0, -3));
      documents.push(parse(await fs.readFile(documentPath(contentPath, category, slug), "utf8"), category, slug));
    }
  }
  return documents.sort((a, b) => a.title.localeCompare(b.title));
}
export async function saveGameDesignDocument(projectPath: string, document: GameDesignDocument, isUpdate: boolean): Promise<void> {
  const category = validateCategory(document.category);
  const slug = validateSlug(document.slug);
  if (!document.title.trim()) throw new Error("Title is required");
  if (typeof document.content !== "string" || typeof document.description !== "string") throw new Error("Invalid document");
  const { contentPath } = await openProject(projectPath);
  const filename = documentPath(contentPath, category, slug);
  await fs.mkdir(path.dirname(filename), { recursive: true });
  if (isUpdate) await fs.access(filename);
  else {
    try { await fs.access(filename); throw new Error("Document already exists"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  }
  await fs.writeFile(filename, serialize(document), "utf8");
}
export async function deleteGameDesignDocument(projectPath: string, category: GameDesignCategory, slug: string): Promise<void> {
  const { contentPath } = await openProject(projectPath);
  await fs.unlink(documentPath(contentPath, category, slug));
}
