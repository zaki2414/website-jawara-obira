// components/admin/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Bold, Italic, Heading2, List, ListOrdered, Link as LinkIcon, Eraser, Info, Loader2 } from "lucide-react";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten di sini...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 border-2 border-on-surface rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor)
    return (
      <div className="flex items-center gap-2 p-4 border-2 border-on-surface rounded-lg bg-surface-container-low text-on-surface-variant text-sm font-bold">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Memuat editor...
      </div>
    );

  const toolbarButtonClass = (active: boolean) =>
    `p-2 rounded-lg border-2 transition-colors ${
      active
        ? "bg-primary text-on-primary border-on-surface"
        : "bg-background text-on-surface-variant border-transparent hover:border-on-surface hover:bg-surface-container"
    }`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-container-low border-2 border-on-surface rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Tebal"
          aria-pressed={editor.isActive("bold")}
          className={toolbarButtonClass(editor.isActive("bold"))}
        >
          <Bold className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Miring"
          aria-pressed={editor.isActive("italic")}
          className={toolbarButtonClass(editor.isActive("italic"))}
        >
          <Italic className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Judul Bagian (H2)"
          aria-pressed={editor.isActive("heading", { level: 2 })}
          className={toolbarButtonClass(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Daftar Poin"
          aria-pressed={editor.isActive("bulletList")}
          className={toolbarButtonClass(editor.isActive("bulletList"))}
        >
          <List className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Daftar Bernomor"
          aria-pressed={editor.isActive("orderedList")}
          className={toolbarButtonClass(editor.isActive("orderedList"))}
        >
          <ListOrdered className="size-4" aria-hidden="true" />
        </button>
        <div className="w-px h-6 bg-outline-variant mx-1" aria-hidden="true" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL Link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          aria-label="Sisipkan Tautan"
          className={toolbarButtonClass(false)}
        >
          <LinkIcon className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          aria-label="Bersihkan Format"
          className={`ml-auto ${toolbarButtonClass(false)}`}
        >
          <Eraser className="size-4" aria-hidden="true" />
        </button>
      </div>
      <EditorContent editor={editor} />
      <p className="flex items-center gap-1.5 text-xs text-on-surface-variant/70">
        <Info className="size-3.5 shrink-0" aria-hidden="true" /> Editor teks saja. Gambar utama & pendukung diupload di bagian bawah.
      </p>
    </div>
  );
}
