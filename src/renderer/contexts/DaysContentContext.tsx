import { createContext, useCallback, useContext, useState } from "react";
import { ProjectOptions } from "../../schemas/project";
import { Outlet } from "react-router-dom";
import { DayDirectory, DayLessonContent, DaysContent } from "../../schemas/day";

interface DaysContentContextValue {
  daysContent: DaysContent | null;
  loading: boolean;
  error: string | null;
  loadDaysContent: (
    projectPath: string,
    options: ProjectOptions,
  ) => Promise<void>;
  findDayContent: (day: DayDirectory) => DayLessonContent | undefined;
}

const DaysContentContext = createContext<DaysContentContextValue | null>(null);

export function DaysContentProvider() {
  const [daysContent, setDaysContent] = useState<DaysContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDaysContent = useCallback(
    async (projectPath: string, options: ProjectOptions) => {
      if (!projectPath) return;

      setLoading(true);
      setError(null);

      try {
        const content = await window.rosewood.getDaysContent(
          projectPath,
          options,
        );

        setDaysContent(content);
      } catch (error) {
        setDaysContent(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load level content.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const findDayContent = (
    dayDirectory: DayDirectory,
  ): DayLessonContent | undefined => {
    return daysContent?.days.find((day) => day.dayDirectory === dayDirectory);
  };

  return (
    <DaysContentContext.Provider
      value={{
        daysContent,
        loading,
        error,
        loadDaysContent,
        findDayContent,
      }}
    >
      <Outlet />
    </DaysContentContext.Provider>
  );
}

export function useDaysContent() {
  const context = useContext(DaysContentContext);

  if (!context) {
    throw new Error(
      "useDaysContent must be used within a DaysContentProvider.",
    );
  }

  return context;
}
