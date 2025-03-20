'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
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
  useState,
} from '../ui';

const TiptapEditor = () => {
  const [previousImages, setPreviousImages] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, Heading, HorizontalRule, Image],
    immediatelyRender: false,
    onUpdate: async ({ editor }) => {
      // Récupérer toutes les images actuelles
      const currentImages =
        editor
          .getHTML()
          .match(/<img src="([^"]+)"/g)
          ?.map((img) => img.replace('<img src="', '').replace('"', '')) || [];

      // Compare with the previous images
      const deletedImages = previousImages.filter(
        (url) => !currentImages.includes(url)
      );

      if (deletedImages.length > 0) {
        try {
          // Delete the images
          const response = await fetch('/api/uploadFiles', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: deletedImages }),
          });

          // Get the response
          const data = await response.json();

          if (data.error) {
            console.error(
              'Error deleting images :',
              data.error
            );
          }
        } catch (error) {
          console.error('Error deleting image :', error);
        }
      }

      // Update the previous images
      setPreviousImages(currentImages);
    },
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

  // Upload media
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // Create a new FormData object
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('media', e.target.files[i]);
    }

    try {
      // Send the files to the server
      const response = await fetch('/api/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      // Get the response
      const data = await response.json();

      // Set the image in the editor
      if (data.files[0].url) {
        editor.chain().focus().setImage({ src: data.files[0].url }).run();
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

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
        title="Horizontal rule"
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
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
        className="p-1 rounded-full m-1"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      >
        <SegmentIcon />
      </button>
      <input
        id="fileInput"
        type="file"
        title="Ajoouter une image"
        onChange={handleFileChange}
        onClick={(event) => {
          event.currentTarget.value = '';
        }}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden" // Cache l'input
        aria-label="Ajouter une image"
      />
      <button
        title="Ajouter une image"
        type="button"
        className="p-1 rounded-full m-1"
        onClick={() => document.getElementById('fileInput')?.click()}
        aria-label="Ajouter une image"
      >
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
