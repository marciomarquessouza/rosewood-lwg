export interface SourceDetailsProps {
  projectPath: string;
  contentPath: string;
  connected: boolean;
  error: string | null;
}

export function SourceDetails({
  projectPath,
  contentPath,
  connected,
  error,
}: SourceDetailsProps) {
  return (
    <div className="text-sm">
      {error && (
        <p className="bg-rosewood-accent p-2 text-rosewood-surface">
          ◆ {error}
        </p>
      )}
      <p className="mb-1 font-light">
        ◆ {connected ? "CONNECTED:" : "DISCONNECTED:"}
      </p>

      <div className="mb-2 flex">
        <span className="mr-1">◆</span>

        <p className="min-w-0">
          <strong>path:</strong>{" "}
          <span className="break-all text-xs font-light">{projectPath}</span>
        </p>
      </div>

      <div className="flex">
        <span className="mr-1">◆</span>

        <p className="min-w-0">
          <strong>content:</strong>{" "}
          <span className="break-all text-xs font-light">{contentPath}</span>
        </p>
      </div>
    </div>
  );
}
