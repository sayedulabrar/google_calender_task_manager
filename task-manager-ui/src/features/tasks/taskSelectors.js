import { searchTasks } from '../../utils/taskHelpers';

// Root selector
export const selectTasksState = (state) => state.tasks;

// All tasks
export const selectAllTasks = (state) => state.tasks.items;

// Filtered tasks (search results)
export const selectFilteredTasks = (state) => state.tasks.filteredTasks;

// Loading state
export const selectTasksLoading = (state) => state.tasks.loading;

// Error
export const selectTasksError = (state) => state.tasks.error;

// Selected task for editing
export const selectSelectedTask = (state) => state.tasks.selectedTask;

// Search query
export const selectSearchQuery = (state) => state.tasks.searchQuery;

// Get task by ID
export const selectTaskById = (state, taskId) =>
  state.tasks.items.find((task) => task.id === taskId);

// Get tasks for a specific date
export const selectTasksByDate = (state, dateString) =>
  state.tasks.filteredTasks.filter((task) => task.start_date === dateString);

// Get tasks for a date range
export const selectTasksByDateRange = (state, startDate, endDate) =>
  state.tasks.filteredTasks.filter(
    (task) => task.start_date >= startDate && task.start_date <= endDate
  );

// Get count of tasks
export const selectTasksCount = (state) => state.tasks.items.length;

// Get today's tasks
export const selectTodaysTasks = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.tasks.filteredTasks.filter((task) => task.start_date === today);
};

// Selector with search applied (memoized outside of component)
export const selectSearchedTasks = (state) => {
  const tasks = state.tasks.filteredTasks;
  const query = state.tasks.searchQuery;
  return searchTasks(tasks, query);
};
