import { useEffect, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import {
  Button,
  FormatColorFillIcon,
  Popover,
} from '@/components/ui';

type ColorPickerButtonProps = {
  editor: any;
  className?: string;
};

const useColorPicker = ({
  editor,
  className,
}: ColorPickerButtonProps) => {

  if (!editor) return;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [colorType, setColorType] = useState<'text' | 'highlight' | 'card'>('highlight');
  const [selectedColor, setSelectedColor] = useState<string>('transparent');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#000000');
  const [selectedCardColor, setSelectedCardColor] = useState<string>('transparent');

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handleClose = () => {
   /*  setIsTextColor(false); */
    setAnchorEl(null);
  };

  // Change the color of the text or the highlight
  const handleChangeColor = (color: ColorResult) => {
    if (!editor) return;

    switch (colorType) {
      case 'text':
        editor.chain().focus().setColor(color.hex).run();
        break;
      case 'highlight':
        editor.chain().focus().setHighlight({ color: color.hex }).run();
        break;
      case 'card':
        if (editor.isActive('card')) {
          editor.chain().focus()
            .updateAttributes('card', { backgroundColor: color.hex })
            .run();
        }
        break;
    }
  };

  // Remove the color of the text or the highlight
  const handleRemoveColor = () => {
    if (!editor) return;

    switch (colorType) {
      case 'text':
        editor.chain().focus().unsetColor().run();
        break;
      case 'highlight':
        editor.chain().focus().unsetHighlight().run();
        break;
      case 'card':
        editor.chain().focus()
          .updateAttributes('card', { backgroundColor: null })
          .run();
        break;
    }
  };

console.log('editor', editor);


  useEffect(() => {
    if (!editor.isActive('card')) return;
    
    const bgColor = editor.getAttributes('card').backgroundColor;
    setSelectedCardColor(bgColor || 'transparent');
  }, [editor, editor.getAttributes('card').backgroundColor]);

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

  return {
    anchorEl,
    setAnchorEl,
    colorType,
    setColorType,
    handleChangeColor,
    handleRemoveColor,
    setSelectedColor,
    setSelectedTextColor,
    setSelectedCardColor,
    selectedColor,
    selectedTextColor,
    selectedCardColor,
    handleOpen,
    handleClose,
    className,
    // ... autres fonctions nécessaires
  };
 /*  return (
    <>
     <button
        className={className}
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setColorType('card');
          handleOpen(event);
        }}
        title="Couleur de fond de la carte"
        style={{
          color: selectedCardColor === 'transparent' ? '#000000' : selectedCardColor,
        }}
        disabled={!editor.isActive('card')}
      >
        <FormatColorFillIcon
          sx={{
            paintOrder: 'normal',
            stroke: 'black',
            strokeWidth: '0.3px',
            fill: selectedCardColor === 'transparent' ? '#000000' : selectedCardColor,
          }}
        />
      </button>
      <button
        className={className}
        type="button"
        onClick={(event) => {
          setColorType('highlight');
          event.preventDefault(), handleOpen(event);
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
          setColorType('text');
          event.preventDefault(), handleOpen(event);
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
           color={
            colorType === 'text' ? selectedTextColor :
            colorType === 'highlight' ? selectedColor :
            selectedCardColor
          }
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
  ); */
};

// CardColorButton.tsx
export const CardColorButton = ({ editor, className }: ColorPickerButtonProps) => {
  const colorPicker = useColorPicker({editor, className});
console.log('colorPicker', colorPicker);

  console.log('editor card', editor);
  if (!colorPicker) return null;

  const { 
    anchorEl, 
    setAnchorEl, 
    setColorType,
    selectedCardColor,
    handleChangeColor,
    handleRemoveColor,
    handleClose,
    colorType,
    selectedTextColor,
    selectedColor,
  } = colorPicker;

  if (!editor) return null;

  return (
    <>
      <button
      title='Couleur de fond de la carte'
        type="button"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setColorType('card');
          setAnchorEl(e.currentTarget);
        }}
        disabled={!editor.isActive('card')}
      >
        <FormatColorFillIcon />
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div style={{ padding: '10px', position: 'relative' }}>
          <SketchPicker
           color={
            colorType === 'text' ? selectedTextColor :
            colorType === 'highlight' ? selectedColor :
            selectedCardColor
          }
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

// CardColorButton.tsx
export const TextColorButton = ({ editor, className }: ColorPickerButtonProps) => {
  const colorPicker = useColorPicker({editor, className});

  if (!colorPicker) return null;

  const { 
    anchorEl, 
    setAnchorEl, 
    setColorType,
    selectedCardColor ,
    handleChangeColor,
    handleRemoveColor,
    handleClose,
    colorType,
    selectedTextColor,
    selectedColor,
  } = colorPicker;

  if (!editor) return null;

  return (
    <>
      <button
        title='Couleur de texte'
        type="button"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setColorType('card');
          setAnchorEl(e.currentTarget);
        }}
        disabled={!editor.isActive('card')}
      >
        <FormatColorFillIcon />
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div style={{ padding: '10px', position: 'relative' }}>
          <SketchPicker
           color={
            colorType === 'text' ? selectedTextColor :
            colorType === 'highlight' ? selectedColor :
            selectedCardColor
          }
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

// CardColorButton.tsx
export const HightlightColorButton = ({ editor, className }: ColorPickerButtonProps) => {
  const colorPicker = useColorPicker({editor, className});
  
  if (!colorPicker) return null;
  
  const { 
    anchorEl, 
    setAnchorEl, 
    setColorType,
    selectedCardColor ,
    handleChangeColor,
    handleRemoveColor,
    handleClose,
    colorType,
    selectedTextColor,
    selectedColor,
  } = colorPicker;

  if (!editor) return null;

  return (
    <>
      <button
        title='Couleur de surlignage'
      type='button'
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setColorType('card');
          setAnchorEl(e.currentTarget);
        }}
        disabled={!editor.isActive('card')}
      >
        <FormatColorFillIcon />
      </button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div style={{ padding: '10px', position: 'relative' }}>
          <SketchPicker
           color={
            colorType === 'text' ? selectedTextColor :
            colorType === 'highlight' ? selectedColor :
            selectedCardColor
          }
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
