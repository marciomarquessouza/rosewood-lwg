import { createContext, useCallback, useContext, useState } from "react";
import { ProjectOptions } from "../../schemas/project";
import { Outlet } from "react-router-dom";
import { DaysContent } from "../../schemas/day";

interface DaysContentContextValue {
  daysContent: DaysContent | null;
  loading: boolean;
  error: string | null;
  loadDaysContent: (
    projectPath: string,
    options: ProjectOptions,
  ) => Promise<void>;
}

const DaysContentContext = createContext<DaysContentContextValue | null>(null);

export function DaysContentProvider() {
  const [daysContent, setDaysContent] = useState<DaysContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDaysContent = useCallback(
    async (projectPath: string, options: ProjectOptions) => {
      setLoading(true);
      setError(null);

      if (!projectPath) return;

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

  return (
    <DaysContentContext.Provider
      value={{
        daysContent,
        loading,
        error,
        loadDaysContent,
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
