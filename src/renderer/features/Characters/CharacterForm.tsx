import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Collapsible } from "../../components/Collapsible";
import { MarkdownEditor } from "../../components/MarkdownField";
import { Feedback } from "../../components/Feedback";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useFeedback } from "../../contexts/FeedbackContext";
import {
  characterProfileSchema,
  type CharacterProfile,
} from "../../../schemas/characterProfile";
import { Avatar } from "../../components/Avatar";
import { CharacterTimeline } from "./CharacterTimeline";

const initialCharacter: CharacterProfile = {
  id: "",
  name: "",
  displayName: "",
  description: "",
  appearance: "",
  personality: "",
  background: "",
  lore: "",
  notes: "",
  avatarPath: "",
  timeline: [],
};

const markdownFields = [
  { key: "description", label: "Description" },
  { key: "appearance", label: "Appearance" },
  { key: "personality", label: "Personality" },
  { key: "background", label: "Background" },
  { key: "lore", label: "Lore" },
  { key: "notes", label: "Notes" },
] as const;

export function CharacterForm() {
  const { characterId } = useParams();
  const isUpdate = characterId !== undefined;
  const { projectPath } = useProjectInfo();
  const {
    projectContent,
    loadProjectContent,
    loading: contentLoading,
  } = useProjectContent();
  const { showFeedback, clearFeedback } = useFeedback();
  const navigate = useNavigate();
  const [character, setCharacter] =
    useState<CharacterProfile>(initialCharacter);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CharacterProfile, string>>
  >({});
  const current = projectContent?.characters.find(
    (item) => item.id === characterId,
  );

  useEffect(() => {
    setCharacter(
      current
        ? { ...current, timeline: current.timeline ?? [] }
        : initialCharacter,
    );
    setErrors({});
  }, [characterId, current]);

  const setField = (field: keyof CharacterProfile, value: string) => {
    setCharacter((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const result = characterProfileSchema.safeParse(character);
    if (!result.success) {
      const flattened = z.flattenError(result.error);
      const fieldErrors: Partial<Record<keyof CharacterProfile, string>> = {};
      for (const field of Object.keys(
        initialCharacter,
      ) as (keyof CharacterProfile)[]) {
        fieldErrors[field] = flattened.fieldErrors[field]?.[0];
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setSaving(true);
      clearFeedback();
      await window.rosewood.saveCharacter(projectPath, result.data, isUpdate);
      await loadProjectContent();
      showFeedback({
        type: "success",
        message: isUpdate ? "Character updated" : "Character created",
      });
      if (!isUpdate) navigate(`/characters/${result.data.id}`);
    } catch (error) {
      showFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save character",
      });
    } finally {
      setSaving(false);
    }
  };

  const submitRef = useRef(handleSubmit);
  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!event.repeat && !saving && !contentLoading)
          void submitRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saving, contentLoading]);

  if (isUpdate && !contentLoading && !current) {
    return <Feedback variant="error">Character not found</Feedback>;
  }

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">
            {isUpdate ? "Character" : "New Character"}
          </p>
          <Button
            variant="accent"
            loading={saving}
            disabled={saving || contentLoading}
            onClick={handleSubmit}
          >
            {isUpdate ? "Save Changes" : "Create"}
          </Button>
        </div>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden xl:flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-8">
            <Collapsible title="Identity">
              <div className="flex flex-col gap-6 px-2 py-3 md:flex-row">
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <Avatar
                    name={character.displayName || character.name}
                    src={character.avatarPath || undefined}
                    size="xl"
                    shape="square"
                  />
                  <span className="text-xs text-rosewood-ink/60">
                    Character Avatar
                  </span>
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="character-id"
                    label="ID"
                    value={character.id}
                    readOnly={isUpdate}
                    placeholder="josef-g"
                    error={errors.id}
                    onChange={(event) => setField("id", event.target.value)}
                  />

                  <Input
                    id="character-name"
                    label="Name"
                    value={character.name}
                    error={errors.name}
                    onChange={(event) => setField("name", event.target.value)}
                  />

                  <Input
                    id="character-display-name"
                    label="Display Name"
                    value={character.displayName}
                    onChange={(event) =>
                      setField("displayName", event.target.value)
                    }
                  />

                  <Input
                    id="character-avatar-path"
                    label="Avatar Path"
                    value={character.avatarPath ?? ""}
                    placeholder="/images/characters/josef.png"
                    error={errors.avatarPath}
                    onChange={(event) =>
                      setField("avatarPath", event.target.value)
                    }
                  />
                </div>
              </div>
            </Collapsible>

            {markdownFields.map(({ key, label }) => (
              <Collapsible
                key={key}
                title={label}
                defaultOpen={key === "description"}
              >
                <div className="px-2 py-3">
                  <MarkdownEditor
                    value={character[key]}
                    onChange={(value) => setField(key, value)}
                    placeholder={`Write ${label.toLowerCase()} here...`}
                  />
                </div>
              </Collapsible>
            ))}
          </div>
        </div>

        <CharacterTimeline
          entries={character.timeline}
          disabled={saving || contentLoading}
          onChange={(timeline) => {
            setCharacter((previous) => ({ ...previous, timeline }));
            setErrors((previous) => ({ ...previous, timeline: undefined }));
          }}
        />
      </div>
    </Panel>
  );
}
