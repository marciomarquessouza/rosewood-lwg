import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

interface NavigationHistory {
  keys: string[];
  index: number;
}

export function NavigationControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [history, setHistory] = useState<NavigationHistory>(() => ({
    keys: [location.key],
    index: 0,
  }));

  useEffect(() => {
    setHistory((current) => {
      const { keys, index } = current;

      if (keys[index] === location.key) {
        return current;
      }

      if (navigationType === "REPLACE") {
        const updated = [...keys];
        updated[index] = location.key;

        return { keys: updated, index };
      }

      if (navigationType === "POP") {
        const existingIndex = keys.indexOf(location.key);

        if (existingIndex !== -1) {
          return {
            keys,
            index: existingIndex,
          };
        }

        // A location outside the tracked session becomes
        // the beginning of a new tracked history.
        return {
          keys: [location.key],
          index: 0,
        };
      }

      // PUSH: discard forward history when navigating
      // to a new route after going back.
      return {
        keys: [...keys.slice(0, index + 1), location.key],
        index: index + 1,
      };
    });
  }, [location.key, navigationType]);

  const canGoBack = history.index > 0;

  const canGoForward = history.index < history.keys.length - 1;

  const buttonClass = [
    "flex size-9 items-center justify-center",
    "rounded-full border-2 border-rosewood-ink",
    "bg-rosewood-surface text-rosewood-ink",
    "transition-all duration-150",
    "hover:bg-rosewood-ink hover:text-white",
    "disabled:cursor-not-allowed",
    "disabled:opacity-30 disabled:hover:bg-rosewood-surface",
    "disabled:hover:text-rosewood-ink",
  ].join(" ");

  return (
    <nav
      aria-label="Page navigation"
      className="flex shrink-0 items-center gap-2"
    >
      <button
        type="button"
        aria-label="Go back"
        title="Go back"
        className={buttonClass}
        disabled={!canGoBack}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        aria-label="Go forward"
        title="Go forward"
        className={buttonClass}
        disabled={!canGoForward}
        onClick={() => navigate(1)}
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </nav>
  );
}
