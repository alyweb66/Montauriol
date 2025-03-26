import {
  useState,
  Popover,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Box,
  Divider,
  YouTubeIcon,
  toast,
} from '@/components/ui';

const sizes = [
  { label: 'Petit', width: 320, height: 180 },
  { label: 'Grand', width: 640, height: 360 },
];

import { Editor } from '@tiptap/core';


// YouTube popover
export const YoutubePopover = ({ editor }: { editor: Editor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [step, setStep] = useState<'url' | 'size'>('url');
  const [url, setUrl] = useState('');
  const [selectedSize, setSelectedSize] = useState(sizes[1]);

  // Open the popover
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setStep('url');
    setUrl('');
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
    setStep('url');
    setUrl('');
  };

  // Check if the URL is a YouTube URL
  const handleUrlSubmit = () => {

    if (url.match(/youtube\.com|youtu\.be/)) {
    // Conversion en URL embed
    let videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|\/|$)/)?.[1];
    
    if (!videoId) {
      toast.error("Format d'URL YouTube non reconnu");
      return;
    }

    // Construction de l'URL embed sécurisée
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    
    // Mise à jour de l'URL et passage à l'étape suivante
    setUrl(embedUrl);
    setStep('size');
  }
  };

  // Insert
  const handleInsert = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'customYoutube',
        attrs: {
          src: url,
          width: selectedSize.width,
          height: selectedSize.height,
        },
      })
      .run();
    handleClose();
  };

  return (
    <>
      <button
        title="Ajouter une vidéo YouTube"
        type="button"
        id="add"
        className="p-1 rounded-full m-1 active:scale-80 transition transform"
        onClick={handleOpen}
      >
        <YouTubeIcon />
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
        {step === 'url' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Ajouter une vidéo YouTube
            </Typography>
            <TextField
              autoFocus
              label="URL YouTube"
              variant="outlined"
              fullWidth
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://youtube.com/..."
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
                onClick={handleUrlSubmit}
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
                Suivant
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Choisir la taille</Typography>
            <List dense sx={{ p: 0 }}>
              {sizes.map((size) => (
                <ListItem key={size.label} disablePadding>
                  <ListItemButton
                    selected={selectedSize.label === size.label}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      borderRadius: '8px',
                      '&.Mui-selected': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography>{size.label}</Typography>
                      <Typography color="text.secondary">
                        {size.width}x{size.height}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="text"
                onClick={() => setStep('url')}
                sx={{
                    borderRadius: '8px',
                    color: 'var(--color-textButton)',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'var(--color-backgroundHoverButton)',
                    },
                  }}
              >
                Retour
              </Button>
              <Button
                variant="contained"
                onClick={handleInsert}
                sx={{
                    borderRadius: '8px',
                    color: 'var(--color-textPrimary)',
                    backgroundImage: 'var(--color-adminButton)',
                    '&:hover': {
                      backgroundImage: 'var(--color-hoverAdminButton)',
                    },
                  }}
              >
                Insérer
              </Button>
            </Box>
          </Box>
        )}
      </Popover>
    </>
  );
};

// Utilisation dans votre composant principal :
// <YoutubePopover editor={editor} />
