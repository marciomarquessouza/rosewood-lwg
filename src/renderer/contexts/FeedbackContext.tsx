import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Feedback } from "../components/Feedback";

export type FeedbackType = "error" | "warning" | "info" | "success";

interface FeedbackMessage {
  type: FeedbackType;
  message: string;
  timeout?: number;
}

interface FeedbackContextValue {
  showFeedback: (feedback: FeedbackMessage) => void;
  clearFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

interface FeedbackProviderProps {
  children: ReactNode;
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const showFeedback = useCallback((message: FeedbackMessage) => {
    setFeedback(message);
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(clearFeedback, feedback.timeout ?? 5000);

    return () => clearTimeout(timer);
  }, [feedback, clearFeedback]);

  return (
    <FeedbackContext.Provider value={{ showFeedback, clearFeedback }}>
      {children}

      {feedback &&
        createPortal(
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <Feedback variant={feedback.type} onClose={clearFeedback}>
              {feedback.message}
            </Feedback>
          </div>,
          document.body,
        )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }

  return context;
}
