import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { MarkdownEditor } from "../../components/MarkdownField";
import { Feedback } from "../../components/Feedback";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useFeedback } from "../../contexts/FeedbackContext";
import { GAME_DESIGN_CATEGORIES, type GameDesignCategory, type GameDesignDocument } from "../../../shared/gameDesign";

const categories: Record<GameDesignCategory, string> = {
  overview: "Overview", mechanics: "Mechanics", lore: "Lore",
};
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function GameDesignPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { projectPath, connected } = useProjectInfo();
  const { projectContent, loadProjectContent } = useProjectContent();
  const { showFeedback, clearFeedback } = useFeedback();
  const categoryValid = !!category && GAME_DESIGN_CATEGORIES.includes(category as GameDesignCategory);
  const selectedCategory = categoryValid ? category as GameDesignCategory : "overview";
  const documents = projectContent?.gameDesign ?? [];
  const current = documents.find((doc) => doc.category === selectedCategory && doc.slug === slug);
  const editing = !!slug && slug !== "new";
  const [draft, setDraft] = useState<GameDesignDocument>({ category: "overview", slug: "", title: "", description: "", content: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setDraft(current ?? { category: selectedCategory, slug: "", title: "", description: "", content: "" });
    setError("");
  }, [current, selectedCategory, slug]);
  const save = async () => {
    const doc = { ...draft, slug: editing ? draft.slug : slugify(draft.title) };
    if (!doc.title.trim() || !doc.slug) { setError("A valid title is required."); return; }
    setBusy(true); setError(""); clearFeedback();
    try {
      await window.rosewood.saveGameDesignDocument(projectPath, doc, editing);
      await loadProjectContent();
      showFeedback({ type: "success", message: editing ? "Document updated" : "Document created" });
      if (!editing) navigate(`/game-design/${doc.category}/${doc.slug}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save document"); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!editing || !window.confirm(`Delete "${draft.title}" permanently?`)) return;
    setBusy(true); clearFeedback();
    try {
      await window.rosewood.deleteGameDesignDocument(projectPath, selectedCategory, draft.slug);
      await loadProjectContent();
      navigate("/game-design");
      showFeedback({ type: "success", message: "Document deleted" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete document"); }
    finally { setBusy(false); }
  };
  if (!connected) return <Feedback variant="info">Connect a project to manage game design documents.</Feedback>;
  if (category && !categoryValid) return <Feedback variant="error">Unknown category.</Feedback>;
  if (editing && !current) return <Feedback variant="error">Document not found.</Feedback>;
  if (!category) return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="border-b border-rosewood-ink/15 pb-5">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-rosewood-accent">World / Reference</p>
            <h1 className="font-serif text-3xl font-bold">Game Design</h1>
            <p className="text-sm text-rosewood-ink/60">General information, gameplay mechanics and world lore</p>
          </header>
          <div className="grid gap-5 md:grid-cols-3">
            {GAME_DESIGN_CATEGORIES.map((item) => (
              <section key={item} className="rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold">{categories[item]}</h2>
                  <button aria-label={`Create ${categories[item]} document`} onClick={() => navigate(`/game-design/${item}/new`)}><Plus size={18}/></button>
                </div>
                <div className="space-y-2">
                  {documents.filter((doc) => doc.category === item).map((doc) => (
                    <button key={doc.slug} className="flex w-full items-center gap-2 rounded-md border border-rosewood-ink/15 px-3 py-3 text-left hover:bg-rosewood-ink/5" onClick={() => navigate(`/game-design/${item}/${doc.slug}`)}>
                      <FileText size={16} className="shrink-0 text-rosewood-accent"/><span className="truncate">{doc.title}</span>
                    </button>
                  ))}
                  {!documents.some((doc) => doc.category === item) && <p className="text-sm text-rosewood-ink/50">No documents yet.</p>}
                </div>
                <button className="mt-5 flex items-center gap-2 text-xs font-bold uppercase text-rosewood-accent" onClick={() => navigate(`/game-design/${item}/new`)}><Plus size={14}/> New document</button>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
  return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden" header={
      <div className="flex items-center justify-between gap-3">
        <div><p className="font-mono text-xs uppercase text-rosewood-accent">{categories[selectedCategory]}</p><h1 className="font-serif text-2xl font-bold">{editing ? draft.title : "New document"}</h1></div>
        <div className="flex gap-3">
          {editing && <Button disabled={busy} onClick={remove}><Trash2 size={16}/> Delete</Button>}
          <Button variant="accent" loading={busy} disabled={busy} onClick={save}>{editing ? "Save changes" : "Create document"}</Button>
        </div>
      </div>
    }>
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 pb-8">
          {error && <Feedback variant="error">{error}</Feedback>}
          <Input id="document-title" label="Title" value={draft.title} onChange={(e) => setDraft((d) => ({...d, title: e.target.value}))} />
          <Input id="document-description" label="Description" value={draft.description} onChange={(e) => setDraft((d) => ({...d, description: e.target.value}))} />
          <div><p className="mb-2 font-bold">Content</p><MarkdownEditor value={draft.content} onChange={(value) => setDraft((d) => ({...d, content: value}))} /></div>
        </div>
      </div>
    </Panel>
  );
}
