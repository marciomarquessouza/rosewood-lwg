import { useLocation, useNavigate } from "react-router-dom";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useFeedback } from "../../contexts/FeedbackContext";
import { Button } from "../Button";

export function Header() {
  const { connected, contentPath, loading } = useProjectInfo();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { projectPath } = useProjectInfo();
  const { showFeedback, clearFeedback } = useFeedback();

  const isDashboard = pathname === "/";

  const pushContent = async (projectPath: string): Promise<string> => {
    const result = await window.rosewood.pushProjectContent(projectPath);
    return result === "empty-tree"
      ? "No changes to publish"
      : "Content published successfully";
  };

  const handlePullPushContent = async (action: "pull" | "push") => {
    clearFeedback();
    try {
      const result =
        action === "pull"
          ? await window.rosewood.pullProjectContent(projectPath)
          : await pushContent(projectPath);
      showFeedback({
        type: "success",
        message: `◆ ${result}`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unexpected error";
      showFeedback({
        type: "error",
        message,
      });
    }
  };

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
        <div className="flex gap-4">
          <Button variant="light" onClick={() => handlePullPushContent("pull")}>
            Pull Project
          </Button>
          <Button
            variant="accent"
            onClick={() => handlePullPushContent("push")}
          >
            Push Project
          </Button>
        </div>
      </div>
    </header>
  );
}
