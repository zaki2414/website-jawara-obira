// components/admin/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

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
          "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 bg-white",
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
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        Loading editor...
      </div>
    );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive("bold") ? "bg-ocean-100 text-ocean-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic ${editor.isActive("italic") ? "bg-ocean-100 text-ocean-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive("heading", { level: 2 }) ? "bg-ocean-100 text-ocean-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("bulletList") ? "bg-ocean-100 text-ocean-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("orderedList") ? "bg-ocean-100 text-ocean-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          1. List
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL Link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 ml-auto"
        >
          🧹 Clear
        </button>
      </div>
      <EditorContent editor={editor} />
      <p className="text-xs text-gray-400">
        💡 Editor teks saja. Gambar utama & pendukung diupload di bagian bawah.
      </p>
    </div>
  );
}
