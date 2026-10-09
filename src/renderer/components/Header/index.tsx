import { useLocation, useNavigate } from "react-router-dom";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";

export function Header() {
  const { connected, contentPath, loading } = useProjectInfo();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDashboard = pathname === "/";

  return (
    <header className="p-6 flex flex-row justify-between">
      <div>
        <h1 className="font-josefin text-3xl font-bold">
          ROSEWOOD -{" "}
          <span className=" text-rosewood-accent">CONTENT MANAGER</span>
        </h1>
        <div className=" flex flex-row font-light text-sm">
          <span>Learning with Ghosts</span>
          <span className=" font-bold mx-1">◆ Status:</span>
          <span>
            {loading
              ? "◆ Loading..."
              : connected
                ? "CONNECTED:"
                : "DISCONNECTED:"}
          </span>
          <span className=" font-bold mx-1">◆ Path:</span>
          <span>{contentPath}</span>
        </div>
      </div>
      <div>
        <button
          onClick={isDashboard ? undefined : () => navigate(-1)}
          className=" bg-rosewood-ink text-rosewood-bg p-2 text-sm min-w-32"
        >
          {isDashboard ? (
            <span>
              DASHBOARD <span className="text-lg">◆</span>
            </span>
          ) : (
            <span>
              BACK <span className="text-lg">◆</span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
