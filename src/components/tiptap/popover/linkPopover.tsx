import {
  Box,
  Button,
  AddLinkIcon,
  Popover,
  TextField,
  Typography,
  useState,
} from '@/components/ui';
import { Editor } from '@tiptap/core';

type LinkPopoverProps = {
  editor: Editor;
  setLink: (url:string) => void;
};

// YouTube popover
export const LinkPopover = ({ editor, setLink }: LinkPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState('');

  // Open the popover
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        title="Ajouter une vidéo YouTube"
        type="button"
        id="add"
        className={`p-1 rounded-full m-1 active:scale-80 transition transform ${
            editor.isActive('link')
              ? 'bg-[image:var(--color-adminButton)] text-white'
              : 'bg-white text-black'
          }`}
        onClick={handleOpen}
      >
        <AddLinkIcon />
      </button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              p: 2,
              width: 320,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'visible',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 14,
                width: 12,
                height: 12,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Ajouter un lien</Typography>
          <TextField
            autoFocus
            label="URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://votre-url/..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              onClick={handleClose}
              sx={{
                borderRadius: '8px',
                color: 'var(--color-textButton)',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'var(--color-backgroundHoverButton)',
                },
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={() => {setLink(url); handleClose();}}
              disabled={!url}
              sx={{
                borderRadius: '8px',
                color: 'var(--color-textPrimary)',
                backgroundImage: 'var(--color-adminButton)',
                '&:hover': {
                  backgroundImage: 'var(--color-hoverAdminButton)',
                },
              }}
            >
              Valider
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
