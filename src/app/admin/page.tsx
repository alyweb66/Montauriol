'use client';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  useState,
  Visibility,
  VisibilityOff,
} from '@/components/ui';

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isActiveSession, setIsActiveSession] = useState(false);

  // Password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // Prevent the password visibility button from submitting the form
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  // Prevent the password visibility button from submitting the form
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[image:var(--color-adminBg)] ">
      <form className="w-100 p-4 bg-adminSecondary  rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <h2 className="text-2xl text-textSecondary">Connexion</h2>
        <TextField
          required
          label="Identifiant"
          variant="outlined"
          margin="normal"
          aria-label='Identifiant'
          fullWidth
        />
        <FormControl sx={{ m: 1, width: '100%', mt: 3 }} variant="outlined">
          <InputLabel 
          required 
          htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActiveSession}
                onChange={(e) => setIsActiveSession(e.target.checked)}
                aria-label="Se souvenir de ma connexion pour les prochaines visites"
              />
            }
            label="Garder ma session active"
          />
        </FormGroup>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={false}
          loadingPosition="start"
          aria-label='Se connecter'
          sx={{
            marginTop: '16px',
            width: '50%',
            color: 'var(--color-textPrimary)',
            backgroundColor: 'var(--color-adminButton)',
            '&:hover': {
              backgroundColor: 'var(--color-hoverAdminButton)',
            },
          }}
        >
          Se connecter
        </Button>
      </form>
    </div>
  );
}
