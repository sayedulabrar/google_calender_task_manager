import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks } from '../features/tasks/taskSelectors';
import { setFilteredTasks, setSearchQuery } from '../features/tasks/taskSlice';
import { searchTasks } from '../utils/taskHelpers';

/**
 * Custom hook for task search and filtering
 */
export const useSearch = (debounceDelay = 300) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const performSearch = useCallback(
    (searchQuery) => {
      const filtered = searchTasks(tasks, searchQuery);
      dispatch(setFilteredTasks(filtered));
      dispatch(setSearchQuery(searchQuery));
    },
    [tasks, dispatch]
  );

  const handleSearch = useCallback(
    (searchQuery) => {
      setQuery(searchQuery);

      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceDelay);

      setDebounceTimer(timer);
    },
    [debounceDelay, debounceTimer, performSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    dispatch(setFilteredTasks(tasks));
    dispatch(setSearchQuery(''));
  }, [tasks, dispatch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    query,
    handleSearch,
    clearSearch,
  };
};
