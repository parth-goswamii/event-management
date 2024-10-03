import React from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton, CircularProgress } from '@mui/material';

const BaseButton = ({ 
  text, 
  onClick, 
  loading = false, 
  type = 'button', 
  disabled = false, 
  variant = 'contained', 
  className,
  color = 'primary', 
  fullWidth = true 
}) => {
  return (
    <MUIButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      color={color}
      className={className}
      fullWidth={fullWidth}
      sx={{ mt: 2 }}
    >
      {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
      {text}
    </MUIButton>
  );
};

BaseButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default BaseButton;
