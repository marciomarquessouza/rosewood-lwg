import { useEffect, useRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  markdownShortcutPlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  ListsToggle,
  CodeToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import "./MarkdownEditor.css";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const plugins = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  markdownShortcutPlugin(),

  toolbarPlugin({
    toolbarContents: () => (
      <>
        <UndoRedo />
        <Separator />

        <BlockTypeSelect />
        <Separator />

        <BoldItalicUnderlineToggles />
        <StrikeThroughSupSubToggles />
        <CodeToggle />
        <Separator />

        <ListsToggle />
        <Separator />

        <CreateLink />
        <InsertTable />
        <InsertThematicBreak />
      </>
    ),
  }),
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write something...",
  disabled = false,
  className = "",
}: MarkdownEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = value ?? "";

    if (editor.getMarkdown() !== nextValue) {
      editor.setMarkdown(nextValue);
    }
  }, [value]);

  return (
    <div className={`markdown-editor ${className}`}>
      <MDXEditor
        ref={editorRef}
        markdown={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        plugins={plugins}
        contentEditableClassName="markdown-editor-content"
      />
    </div>
  );
}
