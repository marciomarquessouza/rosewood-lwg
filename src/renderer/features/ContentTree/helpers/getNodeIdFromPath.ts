export function getNodeIdFromPath(pathname: string): string | null {
  const match = pathname.match(
    /^\/project\/([^/]+)\/([^/]+)\/days\/([^/]+)\/lesson\/?$/,
  );

  if (!match) return null;

  const [, language, level, day] = match;

  return `${language}/${level}/days/${day}`;
}
