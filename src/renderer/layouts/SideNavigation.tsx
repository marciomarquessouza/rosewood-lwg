import { Button } from "../components/Button";
import { Panel } from "../components/Panel";
import { useProjectInfo } from "../contexts/ProjectInfoContext";

export function SideNavigation({ children }: React.PropsWithChildren) {
  const { connected, connect, loading } = useProjectInfo();
  
  return (
    <aside className=" w-80 shrink-0 pb-4">
      <Panel
        variant="support"
        header={
          <div className="flex items-center gap-3">
            <span className="text-rosewood-accent text-2xl">◆</span>
            <h2 className="text-lg font-bold">Content Explorer</h2>
          </div>
        }
        footer={
          <Button variant="accent" onClick={connect} disabled={loading}>
            {loading ? "Loading..." : connected ? "Reconnect" : "Connect"}
          </Button>
        }
      >
        {children}
      </Panel>
    </aside>
  );
}
