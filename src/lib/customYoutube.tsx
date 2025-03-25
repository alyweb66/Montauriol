import { Node, NodeViewProps, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

export const CustomYoutube = Node.create({
  name: 'customYoutube',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {},
      width: { default: 640 },
      height: { default: 360 },
      textAlign: { default: 'left' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
        getAttrs: (dom: any) => ({
          src: dom.getAttribute('src'),
          width: dom.getAttribute('width'),
          height: dom.getAttribute('height'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        frameborder: '0',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: 'true',
        style: `width: ${HTMLAttributes.width}px; height: ${HTMLAttributes.height}px;`,
      }),
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(CustomYoutubeComponent);
  },
});

const CustomYoutubeComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { src, width, height, textAlign } = node.attrs;

    return (
      <NodeViewWrapper 
      className={`custom-youtube-wrapper ${selected ? 'selected-video' : ''}`}
      data-text-align={textAlign}
      style={{width: `${width}px`, height: `${height}px`}}
      >
        <iframe
        title='Vidéo youtube'
        className={`custom-youtube shadow-lg shadow-gray-600 ${selected ? 'selected' : ''}`}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        width={width}  
        height={height}
        style={{width: `${width}px`, height: `${height}px`}}
        />
      </NodeViewWrapper>
    );
  };
