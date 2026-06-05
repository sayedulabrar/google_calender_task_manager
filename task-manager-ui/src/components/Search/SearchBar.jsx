import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import '../../styles/search.css';

/**
 * SearchBar component for searching tasks
 */
export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search tasks...',
  onFocus,
  onBlur,
}) => {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" size={18} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label="Search tasks"
      />
      {value && (
        <button
          className="search-clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
