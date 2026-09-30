import { useProject } from "../../../contexts/ProjectContext";

type ProjectLines = {
  level: string;
  language: string;
  plannedDays: number;
}[];

export function useDashboard() {
  const { connected } = useProject();
}
