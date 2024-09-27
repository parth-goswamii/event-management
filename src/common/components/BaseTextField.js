import React, { useState } from 'react';
import { TextField as MUITextField, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const BaseTextField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  showPasswordToggle,
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <label htmlFor={name} className="form-labell">{label}</label>
      <MUITextField
        fullWidth
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        size='small'
        placeholder={placeholder}
        variant="outlined"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: showPasswordToggle && type === "password" && (
            <IconButton onClick={handleToggleShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default BaseTextField;