// CustomImage.tsx
import { useEffect, useRef, useState } from '@/components/ui';
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

  // Add attributes
  addAttributes() {
    return {
      src: {},
      alt: { default: null },
      title: { default: null },
      width: { default: 'auto' },
      height: { default: 'auto' },
      textAlign: { default: 'left' },
    };
  },

  // Parse HTML
  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  // Render HTML
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  // Add the node view
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
  const { src, width, height, textAlign } = node.attrs;

  const isResizingRef = useRef(false); // Ref to keep track of resizing state
  const [isResizing, setIsResizing] = useState(false);

  // Start resizing
  const onResizeStart = () => {
    isResizingRef.current = true;
    setIsResizing(true); // Force re-render to prevent text selection
  };

  // Get the container width
  const container = document.querySelector('.editor-content');
  const maxWidth = container ? container.clientWidth : Infinity;
  // Initial width and height
  const initialWidth = width === 'auto' ? 200 : parseInt(width);
  const initialHeight = height === 'auto' ? 200 : parseInt(height);

  // Function called when resizing stops
  const onResizeStop: ResizableBoxProps['onResizeStop'] = (event, { size }) => {
    isResizingRef.current = false;
    setIsResizing(false);
    updateAttributes({
      width: `${size.width}px`,
      height: `${size.height}px`,
    });
  };
  return (
    <NodeViewWrapper 
    className={`custom-image-wrapper ${selected ? 'selected-image' : ''}`}
    data-text-align={textAlign}
     // Stop drag events when resizing
    onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
     if (isResizingRef.current) {
       event.preventDefault();
       event.stopPropagation();
     }
      }}
      style={{ 
      // Stop user selection and pointer events when resizing
      userSelect: isResizing ? 'none' : 'auto',
      pointerEvents: isResizing ? 'none' : 'auto' 
    }}
      >
      <ResizableBox
        width={initialWidth}
        height={initialHeight}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        minConstraints={[50, 50]}
        maxConstraints={[maxWidth, Infinity]}
        handle={
          selected ? (
            <span
              className="custom-handle"
              onMouseDown={(event) => {
                setIsResizing(true);
                event.stopPropagation();
                event.preventDefault();
              }}
              onMouseUp={() => setIsResizing(false)}
              onDragStart={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onResizeStart();
              }}
            />
          ) : undefined
        }
      >
        <img
          src={src}
          className={`custom-image shadow-lg shadow-gray-600 ${selected ? 'selected' : ''}`}
          alt={node.attrs.alt || ''}
        />
      </ResizableBox>
    </NodeViewWrapper>
  );
};
