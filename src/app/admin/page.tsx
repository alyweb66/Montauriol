'use client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form  className="w-100 p-4 bg-slate-200  rounded-lg shadow-xl flex flex-col items-center space-y-4">
      <h2 className='text-2xl'>Connectez vous</h2>
        <TextField
          required
          label="Identifiant"
          variant="outlined"
          margin="normal"
       /*    sx={{
            ".MuiOutlinedInput-root": {
              input: {
                color: 'white',
              }
            }
          }} */
          fullWidth
        />
         <FormControl sx={{ m: 1, width: '100%', mt: 3 }} variant="outlined">
          <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
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
                  /* sx={{ color: 'white' }} */
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '16px', width: '50%' }}
        >
          Se connecter
        </Button>
      </form>
    </div>
  );
}
