import fs from "node:fs/promises";
import path from "node:path";
import { openProject } from "../project/openProject";
import { characterProfileSchema, type CharacterProfile } from "../../../schemas/characterProfile";

function getCharactersDirectory(contentPath: string) {
  return path.join(contentPath, "characters");
}

function getCharacterFilename(id: string) {
  const parsedId = characterProfileSchema.shape.id.parse(id);
  return `${parsedId}.json`;
}

export async function getCharacters(projectPath: string): Promise<CharacterProfile[]> {
  const { contentPath } = await openProject(projectPath);
  const directory = getCharactersDirectory(contentPath);
  let filenames: string[];
  try {
    filenames = await fs.readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const characters = await Promise.all(
    filenames.filter((name) => name.endsWith(".json")).map(async (name) => {
      const value = JSON.parse(await fs.readFile(path.join(directory, name), "utf8"));
      const character = characterProfileSchema.parse(value);
      if (getCharacterFilename(character.id) !== name) {
        throw new Error(`Character ID does not match filename: ${name}`);
      }
      return character;
    }),
  );
  return characters.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCharacter(
  projectPath: string,
  input: CharacterProfile,
  isUpdate: boolean,
): Promise<void> {
  const character = characterProfileSchema.parse(input);
  const { contentPath } = await openProject(projectPath);
  const directory = getCharactersDirectory(contentPath);
  const filename = path.join(directory, getCharacterFilename(character.id));
  await fs.mkdir(directory, { recursive: true });
  if (isUpdate) {
    await fs.access(filename);
  } else {
    try {
      await fs.access(filename);
      throw new Error(`Character ID already exists: ${character.id}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  await fs.writeFile(filename, JSON.stringify(character, null, 2) + "\n", "utf8");
}
