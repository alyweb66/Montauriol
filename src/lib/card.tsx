import { Node, mergeAttributes, RawCommands } from '@tiptap/core';
import {
  NodeViewWrapper,
  NodeViewProps,
  ReactNodeViewRenderer,
  NodeViewContent,
} from '@tiptap/react';

export const Card = Node.create({
  name: 'card',
  group: 'block',
  content: 'block+',
  defining: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      cardAlign: {
        default: 'left',
        parseHTML: (element) =>
          element.getAttribute('data-card-align') || 'left',
        renderHTML: (attributes) => {
          return {
            'data-card-align': attributes.cardAlign,
          };
        },
      },
      class: {
        default: 'card',
      },
      backgroundColor: { // Nouvel attribut
        default: '#ffffff',
        parseHTML: (element) => element.getAttribute('data-background-color'),
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      /* textAlign: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-text-align') || null,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) {
            return {};
          }
          return {
            'data-text-align': attributes.textAlign,
            style: `text-align: ${attributes.textAlign};`,
          };
        },
      }, */
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'card', class: 'card' }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleCard:
        (attributes = {}) =>
        ({ commands }: { commands: any }) => {
          // Utilise toggleWrap pour envelopper ou désenvelopper le contenu sélectionné
          return commands.toggleWrap(this.name);
        },
    } as Partial<RawCommands>;
  },

  // Add the node view
  addNodeView() {
    return ReactNodeViewRenderer(CardComponent, {
      // Permet le drag sans perdre la sélection
      stopEvent: () => false,
    });
  },
});

const CardComponent: React.FC<
  NodeViewProps & { children?: React.ReactNode }
> = (props) => {
  const { node, selected, editor, getPos } = props;
  const { cardAlign, backgroundColor } = node.attrs;
  console.log('backgroundColor', backgroundColor);
  

  return (
    <NodeViewWrapper
      className={`card shadow-lg shadow-gray-600 ${selected ? 'selected' : ''}`}
      data-card-align={cardAlign as string}
      data-background-color={backgroundColor || undefined}
      style={{ cardAlign: cardAlign as string, backgroundColor }}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        if (event.currentTarget === event.target) {
          event.stopPropagation();
          editor.commands.setNodeSelection(getPos!());
        }
      }}
    >
      <div 
      className="card-content "
      // Permet la sélection de texte à l'intérieur
      onMouseDown={(e) => e.stopPropagation()}
      >
      <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};
