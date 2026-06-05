import React from 'react';
import clsx from 'clsx';
import '../../styles/common.css';

/**
 * Reusable Button component
 */
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        { 'btn--disabled': disabled },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
