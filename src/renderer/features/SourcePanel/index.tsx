interface SourcePanelProps {
  projectPath: string;
  contentPath: string;
  connected: boolean;
  onReconnect: () => void;
}

export function SourcePanel({
  projectPath,
  contentPath,
  connected,
  onReconnect,
}: SourcePanelProps) {
  return (
    <aside className=" w-64 shrink-0">
      <div className="rounded-lg border-2 border-rosewood-ink bg-rosewood-surface p-5 shadow-[6px_7px_0_var(--color-rosewood-accent)]">
        <header className="flex items-center gap-2">
          <span className="text-xl text-rosewood-accent">▣</span>

          <h2 className="text-xl font-bold">SOURCE</h2>
        </header>

        <div className="my-3 border-t-2 border-dotted border-rosewood-ink" />

        <div className="text-sm">
          <p className="mb-1 font-light">
            ◆ {connected ? "CONNECTED:" : "DISCONNECTED:"}
          </p>

          <div className="mb-2 flex">
            <span className="mr-1">◆</span>

            <p className="min-w-0">
              <strong>path:</strong>{" "}
              <span className="break-all text-xs font-light">
                {projectPath}
              </span>
            </p>
          </div>

          <div className="flex">
            <span className="mr-1">◆</span>

            <p className="min-w-0">
              <strong>content:</strong>{" "}
              <span className="break-all text-xs font-light">
                {contentPath}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onReconnect}
            className="
              min-w-30
              rounded-md
              border-2
              border-rosewood-ink
              bg-rosewood-accent
              px-5
              py-2
              font-bold
              text-white
              shadow-[4px_4px_0_var(--color-rosewood-ink)]
              transition-transform
              active:translate-x-1
              active:translate-y-1
              active:shadow-none
            "
          >
            Reconnect
          </button>
        </div>
      </div>
    </aside>
  );
}
