export function getNodeIdFromPath(pathname: string): string | null {
  const character = pathname.match(/^\/characters\/([^/]+)\/?$/);
  if (character && character[1] !== "new") {
    return `characters/${decodeURIComponent(character[1])}`;
  }

  const match = pathname.match(
    /^\/project\/([^/]+)\/([^/]+)\/days\/([^/]+)\/lesson\/?$/,
  );

  if (!match) return null;

  const [, language, level, day] = match;
  return `${language}/${level}/days/${day}`;
}
