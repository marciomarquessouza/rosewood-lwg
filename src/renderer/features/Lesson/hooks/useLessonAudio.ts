import { useRef, useState } from "react";
import { DayLessonContent } from "../../../../schemas/day";
import { LessonContentOptions } from "../../../../schemas/lesson";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { setAudioPath } from "../actions/setAudioPath";

export function useLessonAudio() {
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();
  const [saving, setSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateAudio = async (
    options: LessonContentOptions,
    entryId: string,
    target: string | undefined,
    dayContent: DayLessonContent,
  ) => {
    if (!target) return;

    clearFeedback();

    try {
      setSaving(true);

      const { path } = await window.rosewood.generateAudio(
        projectPath,
        options,
        target,
      );

      await setAudioPath(projectPath, options, entryId, path, dayContent);

      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });

      showFeedback({
        type: "success",
        message: "Audio path updated",
      });
    } catch (error) {
      console.error(error);
      showFeedback({
        type: "error",
        message: `Error generating audio: ${error}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const playAudio = async (path: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const bytes = await window.rosewood.loadAudio(projectPath, path);

      const blob = new Blob([new Uint8Array(bytes)], {
        type: "audio/mpeg",
      });

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioRef.current = audio;

      audio.addEventListener("ended", () => URL.revokeObjectURL(url), {
        once: true,
      });

      await audio.play();
    } catch (error) {
      console.error(error);
      showFeedback({
        type: "error",
        message: `Error playing audio: ${error}`,
      });
    }
  };

  return {
    saving,
    generateAudio,
    playAudio,
  };
}
