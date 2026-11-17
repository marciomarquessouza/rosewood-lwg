import { generateAudio } from "./generateAudio";
import { loadAudio } from "./loadAudio";
import { updateLessonContent } from "./updateLessonContent";
import { updateEntryDetails } from "./updateEntryDetails";

export const lessonsServices = {
  updateLessonContent,
  updateEntryDetails,
  generateAudio,
  loadAudio,
};
