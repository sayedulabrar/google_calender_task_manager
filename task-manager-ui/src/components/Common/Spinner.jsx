import React from 'react';
import '../../styles/common.css';

/**
 * Reusable Spinner/Loading component
 */
export const Spinner = ({ size = 'md', message = 'Loading...' }) => {
  return (
    <div className={`spinner-container spinner-container--${size}`}>
      <div className={`spinner spinner--${size}`} />
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default Spinner;
