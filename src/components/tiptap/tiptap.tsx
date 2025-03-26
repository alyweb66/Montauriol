'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { CustomImage } from '../../lib/resizableImage';
import { CustomYoutube } from '@/lib/customYoutube';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style'
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
  toast,
  useState,
  FormatAlignLeftIcon,
  FormatAlignCenterIcon,
  FormatAlignRightIcon,
  YouTubeIcon,
} from '../ui';
import './titap.css';
import { ColorPickerButton } from './colorPickerButton/colorPickerButton';

const TiptapEditor = () => {
  const [previousImages, setPreviousImages] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'customImage', 'customYoutube'],
      }),
      CustomYoutube,
      Highlight.configure({ multicolor: true }),
      Color.configure({ types: ['textStyle'] }),
      TextStyle.configure({ mergeNestedSpanStyles: true }),
    ],
    immediatelyRender: false,
    onUpdate: async ({ editor }) => {
      // Get the current images
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

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error deleting image');
          }
        } catch (error) {
          let errorMessage = "Erreur lors de la suppression de l'image";
          // Check if the error is an instance of Error
          if (error instanceof Error) {
            if (
              error.message.includes('Internal Server Error') ||
              error.message.includes('Error deleting files')
            ) {
              errorMessage = "Erreur lors de la suppression de l'image";
            }
          }
          toast.error(errorMessage);
        }
      }

      // Update the previous images
      setPreviousImages(currentImages);
    },
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  });

  if (!editor) return <p>Chargement…</p>;

  return (
    <div className="max-w-3xl mx-auto rounded-xl ">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="editor-content w-full p-2 rounded-lg "
      />
    </div>
  );
};

type MenuBarProps = {
  editor: any;
};

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  // State
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  // Upload media
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    // Create a new FormData object
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      formData.append('media', event.target.files[i]);
    }

    try {
      // Send the files to the server
      const response = await fetch('/api/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur HTTP');
      }

      const data = await response.json();

      // Set the image in the editor
      /* if (data.files[0].url) {
        editor.chain().focus().setCustomImage({ src: data.files[0].url }).run();
      } */
      // Insérer l'image dans l'éditeur en utilisant votre extension customImage
      if (data.files[0].url) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'customImage',
            attrs: { src: data.files[0].url },
          })
          .run();
      }
    } catch (error) {
      let errorMessage = "Erreur lors de l'envoi de l'image";
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        console.log(error.message);

        errorMessage = error.message;

        if (error.message.includes('Bad input file')) {
          errorMessage =
            'Format de fichier non supporté (seuls JPG/JPEG/PNG sont autorisés 15Mo max)';
        } else {
          errorMessage = 'Erreur avec le fichier';
        }
      }
      toast.error(errorMessage);
    }
  };


  const addYoutubeVideo = () => {
    // Demande l'URL de la vidéo YouTube
    const url = prompt("Entrez l'URL de la vidéo YouTube");
    if (!url) return;
  
    // Définition des tailles possibles
    const sizes = [
      { label: "Petit (320x180)", width: 320, height: 180 },
      { label: "Grand (640x360)", width: 640, height: 360 },
     
    ];
  
    // Construit le message pour le prompt
    const sizeOptions = sizes
      .map((s, index) => `${index + 1} : ${s.label}`)
      .join("\n");
  
    const choice = prompt(
      `Choisissez la taille de la vidéo en entrant le numéro correspondant :\n${sizeOptions}`
    );
  
    // On sélectionne la taille choisie, par défaut "Moyen" si la saisie est invalide
    const chosenSize = sizes[parseInt(choice ?? '', 10) - 1] || sizes[1];
  
    // Insère la vidéo avec la taille sélectionnée
    editor.chain().focus().insertContent({
      type: 'customYoutube',
      attrs: {
        src: url,
        width: chosenSize.width,
        height: chosenSize.height,
      },
    }).run();

  };
  
  return (
    <div className="w-full border-b-1 border-gray-200 pb-1">
      <button
        title="Taille titre"
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
  
      <ColorPickerButton 
      className="p-1 rounded-full m-1"
      editor={editor} 
      />
  
      <button
        title="Aligner à gauche"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive({ textAlign: 'left' })
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatAlignLeftIcon />
      </button>
      <button
        title="Aligner au centre"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive({ textAlign: 'center' })
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatAlignCenterIcon />
      </button>
      <button
        title="Aligner à droite"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1 rounded-full m-1  ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatAlignRightIcon />
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
        title="Séparateur horizontal"
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
        title="Ajouter une vidéo YouTube"
        type="button"
        id="add"
        className="p-1 rounded-full m-1"
        onClick={addYoutubeVideo}
      >
        <YouTubeIcon />
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
