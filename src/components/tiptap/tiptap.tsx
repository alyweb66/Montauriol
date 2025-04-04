'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { Extension, type Command } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { CustomImage } from '../../lib/resizableImage';
import { CustomYoutube } from '@/lib/customYoutube';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
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
  HorizontalRuleIcon,
  ImageIcon,
  toast,
  useState,
  FormatAlignLeftIcon,
  FormatAlignCenterIcon,
  FormatAlignRightIcon,
  useCallback,
  LinkOffIcon,
  FormatUnderlinedIcon,
  Popover,
  useEffect,
  ViewAgendaIcon,
} from '../ui';
import './titap.css';
import {
  CardColorButton,
  TextColorButton,
  HightlightColorButton,
} from './colorPickerButton/colorPickerButton';
import { YoutubePopover } from './popover/youtubePopover';
import { LinkPopover } from './popover/linkPopover';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import FontFamily from '@tiptap/extension-font-family';
import { TextFormatSelect } from './select/select';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import Image from '@tiptap/extension-image';
import { Card } from '@/lib/card';
import { NodeSelection } from '@tiptap/pm/state';

/* export interface CustomExtensionStorage {
  awesomeness: number
} */

const TiptapEditor = () => {
  const [previousImages, setPreviousImages] = useState<string[]>([]);

  const Emoji = Image.extend({
    name: 'emoji',
    inline: true, // Rendre l'emoji inline
    group: 'inline',
    draggable: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#e17100', //
        },
      }),
      CustomImage,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'customImage', 'customYoutube'],
      }),
      CustomYoutube,
      Highlight.configure({ multicolor: true }),
      Color.configure({ types: ['textStyle'] }),
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === 'string' ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              'example-phishing.com',
              'malicious-site.net',
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              'example-no-autolink.com',
              'another-no-autolink.com',
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      Underline,
      Typography,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Tapez votre texte ici …',
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
      FontFamily,

      Emoji.configure({
        HTMLAttributes: {
          class: 'emoji',
        },
      }),
      Card,
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

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectionType, setSelectionType] = useState<'text' | 'card' | null>(
    null
  );
  console.log('selectionType', selectionType);

  // Mettre à jour l'état quand la sélection change
  useEffect(() => {
    console.log('selectionType', editor.state.selection);

    const handleSelectionChange = () => {
      const selection = editor.state.selection;
      if (selection instanceof NodeSelection) {
        const nodeTypeName = selection.node.type.name;
        if (nodeTypeName === 'card') {
          console.log('Type de nœud sélectionné:', nodeTypeName); // "card"
          setSelectionType('card');
        } else {
          console.log('Type de nœud sélectionné:', nodeTypeName); // "text"
          setSelectionType('text');
        }
      } else {
        console.log('Aucun nœud sélectionné');
        setSelectionType('text');
      }
    };
    /*  if (editor.isActive('card')) {
        const { from, to } = editor.state.selection;
        let isCardNodeSelected = false;

        editor.state.doc.nodesBetween(from, to, (node) => {
          if (node.type.name === 'card') {
            isCardNodeSelected = true;
          }
        });

        if (isCardNodeSelected) {
          setSelectionType('card');
        } else {
          setSelectionType('text');
        }
      } else {
        setSelectionType(null);
      }
    }; */

    editor.on('selectionUpdate', handleSelectionChange);
    return () => {
      editor.off('selectionUpdate', handleSelectionChange);
    };
  }, [editor?.state.selection]);

  const handleAlign = (align: 'left' | 'center' | 'right') => {
    if (selectionType === 'card') {
      editor
        .chain()
        .focus()
        .updateAttributes('card', { cardAlign: align })
        // Réapplique la sélection après modification
        .setNodeSelection(editor.state.selection.from)
        .run();
    } else {
      editor.chain().focus().setTextAlign(align).run();
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    console.log('emojiObject', emojiObject);

    editor.chain().focus().setImage({ src: emojiObject.imageUrl }).run();
  };

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

  // Set link
  const setLink = useCallback(
    (url: string) => {
      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();

        return;
      }

      // update link
      try {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Une erreur est survenue');
        }
      }
    },
    [editor]
  );

  return (
    <div className="w-full border-b-1 border-gray-200 ">
      <button
        title="Gras"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform  ${
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
        className={`p-1 rounded-full m-1 active:scale-80 transition transform  ${
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
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
          editor.isActive('strike')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatStrikethroughIcon />
      </button>
      <button
        title="Souligner"
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
          editor.isActive('underline')
            ? 'bg-[image:var(--color-adminButton)] text-white'
            : 'bg-white text-black'
        }`}
      >
        <FormatUnderlinedIcon />
      </button>

      <TextFormatSelect editor={editor} isTextSize={true} />
      <TextFormatSelect editor={editor} isTextSize={false} />
      <div className="w-fit rounded-xl border-1 border-gray-200">
        <button
          title="Créer une carte"
          type="button"
          onClick={() => editor.chain().focus().toggleCard().run()}
          className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
            editor.isActive('card')
              ? 'bg-[image:var(--color-adminButton)] text-white'
              : 'bg-white text-black'
          }`}
        >
          <ViewAgendaIcon />
        </button>
        <CardColorButton
          className="p-1 rounded-full m-1 active:scale-80 transition transform"
          editor={editor}
        />
      </div>
      <HightlightColorButton
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        editor={editor}
      />
      <TextColorButton
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        editor={editor}
      />
      <button
        title="Aligner à gauche"
        type="button"
        onClick={() => handleAlign('left')}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        onClick={() => handleAlign('center')}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        onClick={() => handleAlign('right')}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <HorizontalRuleIcon />
      </button>
      <button
        title="Liste à puce"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
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
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
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
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        onClick={() => document.getElementById('fileInput')?.click()}
        aria-label="Ajouter une image"
      >
        <ImageIcon />
      </button>
      <YoutubePopover editor={editor} />
      <LinkPopover editor={editor} setLink={setLink} />
      <button
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        title="Supprimer le lien"
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <LinkOffIcon />
      </button>
      <button
        title="Annuler"
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded-full m-1  bg-white text-black active:scale-80 transition transform"
      >
        <UndoIcon />
      </button>
      <button
        title="Refaire"
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded-full m-1 bg-white text-black active:scale-80 transition transform"
      >
        <RedoIcon />
      </button>
      <button
        title="Insérer un emoji"
        type="button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="p-1 rounded-full m-1 active:scale-80 transition-transform bg-white text-black"
      >
        😀
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div /* className="absolute z-50 top-12 right-4" */>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme={Theme.LIGHT}
            lazyLoadEmojis={true}
            emojiStyle={EmojiStyle.FACEBOOK}
            skinTonesDisabled
            searchDisabled={true}
            height={350}
            width={300}
            previewConfig={{ showPreview: false }}
          />
        </div>
      </Popover>
    </div>
  );
};

export default TiptapEditor;
