import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
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
        <p className=" font-light text-sm">
          Learning with Ghosts ◆ Lesson Day Editor
        </p>
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
