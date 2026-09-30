import { Language } from "../schemas/language";

export const LANGUAGE_DETAILS = {
  "de-DE": { name: "German" },
  "en-UK": { name: "English" },
  "pt-BR": { name: "Portuguese" },
} satisfies Partial<Record<Language, { name: string }>>;
