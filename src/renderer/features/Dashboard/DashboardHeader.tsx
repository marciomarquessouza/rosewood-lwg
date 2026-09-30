import { Pill } from "../../components/Pill";

interface DashboardHeaderProps {
  lines: number;
}
export function DashboardHeader({ lines }: DashboardHeaderProps) {
  return (
    <div className="flex flex-row">
      <div className="flex min-w-4xl flex-col">
        <p className="font-bold text-3xl uppercase">DASHBOARD</p>
        <p className="text-rosewood-accent text-base">
          Language/Level Overview
        </p>
      </div>
      <div className="flex justify-center items-center">
        <Pill variant="accent">
          {lines} {lines > 1 ? "items" : "item"}
        </Pill>
      </div>
    </div>
  );
}
