export interface SourceDetailsProps {
  projectPath: string;
  contentPath: string;
  connected: boolean;
}

export function SourceDetails({
  projectPath,
  contentPath,
  connected,
}: SourceDetailsProps) {
  return (
    <div className="text-sm">
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
