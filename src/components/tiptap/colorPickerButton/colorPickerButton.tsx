import { useEffect, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import {
  Button,
  FormatColorFillIcon,
  FormatColorTextIcon,
  Popover,
} from '@/components/ui';

type ColorPickerButtonProps = {
  editor: any;
  className?: string;
};

export const ColorPickerButton = ({
  editor,
  className,
}: ColorPickerButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isTextColor, setIsTextColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('transparent');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#000000');

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handleClose = () => {
    setIsTextColor(false);
    setAnchorEl(null);
  };

  // Change the color of the text or the highlight
  const handleChangeColor = (color: ColorResult) => {
    if (!editor) return;

    if (isTextColor) {
      editor.chain().focus().setColor(color.hex).run();
    } else {
      editor.chain().focus().setHighlight({ color: color.hex }).run();
    }
  };

  // Remove the color of the text or the highlight
  const handleRemoveColor = () => {
    if (!editor) return;

    if (isTextColor) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  // Update the highlight color when the editor's color changes
  useEffect(() => {
    if (!editor.getAttributes('highlight').color) {
      setSelectedColor('transparent');
    } else {
      setSelectedColor(editor.getAttributes('highlight').color);
    }
  }, [editor.getAttributes('highlight').color]);

  // Update the text color when the editor's color changes
  useEffect(() => {
    if (!editor.getAttributes('textStyle').color) {
      setSelectedTextColor('#000000');
    } else {
      setSelectedTextColor(editor.getAttributes('textStyle').color);
    }
  }, [editor.getAttributes('textStyle').color]);

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={(event) => {
          event.preventDefault(), setIsTextColor(false), handleOpen(event);
        }}
        title="Couleur de surlignage"
        style={{
          color: selectedColor === 'transparent' ? '#000000' : selectedColor,
        }}
      >
        <FormatColorFillIcon
          sx={{
            paintOrder: 'normal', // Draw the outline first
            stroke: 'black', // Black outline
            strokeWidth: '0.3px', // Outline thickness
            fill: selectedColor === 'transparent' ? '#000000' : selectedColor, // Fill color
          }}
        />
      </button>
      <button
        className={className}
        type="button"
        onClick={(event) => {
          event.preventDefault(), setIsTextColor(true), handleOpen(event);
        }}
        title="Couleur de texte"
        style={{ color: selectedTextColor }}
      >
        <FormatColorTextIcon
          sx={{
            paintOrder: 'normal',
            stroke: 'black',
            strokeWidth: '0.3px',
            fill: selectedTextColor,
          }}
        />
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div style={{ padding: '10px', position: 'relative' }}>
          <SketchPicker
            color={isTextColor ? selectedTextColor : selectedColor}
            onChange={handleChangeColor}
            disableAlpha={true}
          />
          <Button
            type="button"
            title="Enlever la couleur"
            onClick={(event) => {
              event.preventDefault();

              handleRemoveColor();
            }}
            sx={{
              marginTop: '0.5rem',
              color: 'var(--color-textPrimary)',
              backgroundImage: 'var(--color-adminButton)',
              '&:hover': {
                backgroundImage: 'var(--color-hoverAdminButton)',
              },
            }}
          >
            Enlever la couleur
          </Button>
        </div>
      </Popover>
    </>
  );
};
