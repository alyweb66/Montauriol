// CustomImage.tsx
import { Node, mergeAttributes } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewProps,
} from '@tiptap/react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const CustomImage = Node.create({
  name: 'customImage',
  group: 'block',
  inline: false,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {},
      alt: { default: null },
      title: { default: null },
      width: { default: 'auto' },
      height: { default: 'auto' },
    };
  },


  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent, {
      stopEvent: (event) => false,
    });
  },
});

type ResizableImageComponentProps = NodeViewProps;

const ResizableImageComponent: React.FC<ResizableImageComponentProps> = (
  props
) => {
  const { node, updateAttributes, selected } = props;
  const { src, width, height } = node.attrs;

  // Récupérer la largeur du conteneur parent (assurez-vous que la classe correspond)
  const container = document.querySelector('.editor-content');
  const maxWidth = container ? container.clientWidth : Infinity;
  // On définit des dimensions initiales en cas de "auto"
  const initialWidth = width === 'auto' ? 200 : parseInt(width);
  const initialHeight = height === 'auto' ? 200 : parseInt(height);

const onResizeStop: ResizableBoxProps['onResizeStop'] = (event, { size }) => {
  updateAttributes({
    width: `${size.width}px`,
    height: `${size.height}px`,
  });
};
  return (
    <NodeViewWrapper className={selected ? 'selected-image' : ''}>
      <ResizableBox
        width={initialWidth}
        height={initialHeight}
        onResizeStop={onResizeStop}
        minConstraints={[50, 50]}
        maxConstraints={[maxWidth, Infinity]}
        /* axis="both" */
        handle={
          selected ? (
            <span
              className="custom-handle"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDragStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          ) : undefined
        }
      >
        <img
          src={src}
          className={`custom-image shadow-lg shadow-gray-600 ${selected ? 'selected' : ''}`}
          alt={node.attrs.alt || ''}
          /* style={{ width: '100%', height: '100%' }} */
            />
      </ResizableBox>
    </NodeViewWrapper>
  );
};
