import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { Pill } from "../../components/Pill";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { CharacterCard } from "./CharacterCard";

export function CharactersDashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { projectContent, loading, error } = useProjectContent();
  const characters = projectContent?.characters ?? [];

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="text-3xl font-bold uppercase">Characters</h1>
            <p className="text-base text-rosewood-accent">Character Overview</p>
          </div>
          <Pill variant="accent">
            {characters.length}{" "}
            {characters.length === 1 ? "character" : "characters"}
          </Pill>
        </div>
      }
      footer={
        <div className="flex flex-1 items-end justify-end">
          <Button
            variant="dark"
            disabled={!connected}
            onClick={() => navigate("/characters/new")}
          >
            Add New Character
          </Button>
        </div>
      }
    >
      {!connected ? (
        <p className="text-md">Not Connected</p>
      ) : error ? (
        <p role="alert" className="text-md text-rosewood-accent">
          {error}
        </p>
      ) : loading && !projectContent ? (
        <p className="text-md">Loading...</p>
      ) : characters.length === 0 ? (
        <p className="text-md">No characters created yet.</p>
      ) : (
        <ul className="grid max-h-full grid-cols-1 gap-5 overflow-y-auto pb-2 sm:grid-cols-2 xl:grid-cols-3">
          {characters.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              index={index}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
