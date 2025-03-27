import { MenuItem, Select } from '@/components/ui';
import { Editor } from '@tiptap/core';
import { SelectChangeEvent } from '@mui/material/Select';
import { fontFamily } from '../font';

type SelectProps = {
  editor: Editor;
  isTextSize?: boolean;
};

type OptionProps = {
  value: string;
  label: string;
  style?: any;
  size?: string;
};

export const TextFormatSelect = ({ editor, isTextSize }: SelectProps) => {
  const headingOptions = [
    { value: 'paragraph', label: 'Taille' },
    { value: '1', label: 'Titre 1', size: '3rem' },
    { value: '2', label: 'Titre 2', size: '2.5rem' },
    { value: '3', label: 'Titre 3', size: '2rem' },
    { value: '4', label: 'Titre 4', size: '1.5rem'},

  ];

  // Actual value
  const currentValue = isTextSize
    ? editor.isActive('heading')
      ? String(editor.getAttributes('heading').level)
      : 'paragraph'
    : editor.getAttributes('textStyle').fontFamily || 'default';

  // Modify the editor
  const handleChange = (value: string | number) => {
    
    if (isTextSize) {
      if (value === 'paragraph') {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level: Number(value) as any }).run();
      }
    } else {
      const font = value === 'default' ? null : value;
      editor
        .chain()
        .focus()
        .setFontFamily(String(font) || '')
        .run();
    }
  };

  return (
    <Select
      value={currentValue}
      onChange={(event: SelectChangeEvent<string>) => {
        handleChange(event.target.value);
      }}
      sx={{
        height: '32px',
        width: '120px',
        fontSize: '0.875rem',
        borderRadius: '9999px',
        margin: '0.25rem',
        '& .MuiSelect-select': {
          padding: '4px 32px 4px 12px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.5',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #e0e0e0',
          borderRadius: '0.6rem',
        },
        backgroundColor: editor.isActive('textStyle', { fontFamily: 'Inter' })
          ? '#ffffff'
          : '#ffffff',
        color: editor.isActive('textStyle', { fontFamily: 'Inter' })
          ? '#000000'
          : '#000000',
        '& .MuiSvgIcon-root': {
          color: editor.isActive('textStyle', { fontFamily: 'Inter' })
            ? '#000000'
            : '#000000',
          right: '4px',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            // Menu style
            borderRadius: '8px',
            marginTop: '4px',

            // Selected style item
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: 'var(--color-backgroundHoverButton) !important',
              color: 'black !important',
            },
          },
        },
      }}
      variant="outlined"
    >
      {(isTextSize ? headingOptions : fontFamily).map((option: OptionProps) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            ...(!isTextSize && option.style),
            // Style for the selected item
            fontSize: '0.875rem',
            minHeight: '32px',
            fontWeight:
              isTextSize && option.value !== 'paragraph' ? 'bold' : 'normal',
            // Show the font size for the selected item
            '&:not(:first-of-type)': {
              fontFamily: !isTextSize
                ? option.style.fontFamily + ' !important'
                : 'inherit',
              fontSize: isTextSize
                ? option.size
                : 'inherit',
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};
