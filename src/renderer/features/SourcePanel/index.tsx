import databaseIcon from "../../../assets/icons/database.svg";
import { Button } from "../../components/Button/index.tsx";
import { Panel } from "../../components/Panel.tsx";
import { SourceDetails, SourceDetailsProps } from "./SourceDetails.tsx";

interface SourcePanelProps extends SourceDetailsProps {
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
      <Panel
        variant="support"
        header={
          <header className="flex items-center gap-2">
            <span className="text-xl text-rosewood-accent">
              <img src={databaseIcon} alt="" className="size-5" />
            </span>

            <h2 className="text-xl font-bold">SOURCE</h2>
          </header>
        }
        footer={
          <footer className="flex justify-center">
            <Button variant="accent" onClick={onReconnect}>
              Reconnect
            </Button>
          </footer>
        }
      >
        <SourceDetails
          projectPath={projectPath}
          contentPath={contentPath}
          connected={connected}
        />
      </Panel>
    </aside>
  );
}
