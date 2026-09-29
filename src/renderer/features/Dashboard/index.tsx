import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/language/de-DE/A1-1")}>
        Language Level
      </button>
    </div>
  );
}
