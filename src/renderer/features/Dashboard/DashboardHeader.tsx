import { Pill } from "../../components/Pill";

interface DashboardHeaderProps {
  lines: number;
}

export function DashboardHeader({ lines }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-3xl font-bold uppercase">
          Dashboard
        </p>

        <p className="text-base text-rosewood-accent">
          Language/Level Overview
        </p>
      </div>

      <Pill variant="accent">
        {lines} {lines === 1 ? "item" : "items"}
      </Pill>
    </div>
  );
}