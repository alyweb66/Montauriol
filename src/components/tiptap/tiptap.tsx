'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import {
  FormatBoldIcon,
  FormatItalicIcon,
  FormatListBulletedIcon,
  FormatListNumberedIcon,
  FormatStrikethroughIcon,
  FormatQuoteIcon,
  RedoIcon,
  SegmentIcon,
  UndoIcon,
  TitleIcon,
  HorizontalRuleIcon,
  ImageIcon,
} from '../ui';

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Heading, HorizontalRule, Image],

    immediatelyRender: false,
  });

  if (!editor) return <p>Chargement…</p>;

  return (
    <div className="max-w-3xl mx-auto rounded-xl ">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className=" min-h-70 p-4 mt-2 rounded-lg "
      />
    </div>
  );
};

type MenuBarProps = {
  editor: any;
};

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  return (
    <div className=" w-full border-b-1 border-gray-200 pb-1">
 
      <button
        title="Titre 1"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <TitleIcon />
      </button>
  

      <button
        title="Gras"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('bold')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatBoldIcon />
      </button>
      <button
        title="Italique"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('italic')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatItalicIcon />
      </button>
      <button
        title="Barré"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('strike')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatStrikethroughIcon />
      </button>
      <button
        title="Citation"
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('blockquote')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatQuoteIcon />
      </button>
      <button
      title='Horizontal rule'
      type='button' 
      onClick={() => editor.chain().focus().setHorizontalRule().run()}>
           <HorizontalRuleIcon />
          </button>
      <button
        title="Liste à puce"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded-full m-1 ${
          editor.isActive('bulletList')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatListBulletedIcon />
      </button>
      <button
        title="Liste numérotée"
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive('orderedList')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatListNumberedIcon />
      </button>

      <button
        title="Sous liste"
        type="button"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      >
        <SegmentIcon />
      </button>
      <button 
      title="Image"
      type="button"
      onClick={addImage}>
        <ImageIcon />
      </button>
      <button
        title="Annuler"
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded-full m-1  bg-white text-black"
      >
        <UndoIcon />
      </button>
      <button
        title="Refaire"
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded-full m-1 bg-white text-black"
      >
        <RedoIcon />
      </button>
    </div>
  );
};

export default TiptapEditor;
