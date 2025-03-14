'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const TiptapEditor = () => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: '<p>Bienvenue sur Tiptap Editor !</p>',
    });
  
    if (!editor) return <p>Chargement…</p>;
  
    return (
      <div className="max-w-3xl mx-auto p-4 border rounded-xl">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="prose border p-4 rounded-b-lg" />
      </div>
    );
  };
  
  type MenuBarProps = {
    editor: any;
  };
  
  const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return null;
  
    return (
      <div className="grid grid-cols-6 divide-x-7 border divide-gray-300 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded-t-lg   ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1  ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1  ${
            editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1  ${
            editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1  bg-white text-black"
        >
          Retour
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1  bg-white text-black"
        >
          rétablie
        </button>
      </div>
    );
  };
  
  export default TiptapEditor;