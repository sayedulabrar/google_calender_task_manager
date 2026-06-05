import { TASK_COLORS } from './constants';

/**
 * Get a color for a task based on its ID
 */
export const getTaskColor = (taskId) => {
  const index = taskId % TASK_COLORS.length;
  return TASK_COLORS[index];
};

/**
 * Validate task data
 */
export const validateTask = (task) => {
  const errors = {};

  if (!task.title || task.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (task.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (task.description && task.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!task.start_date) {
    errors.start_date = 'Start date is required';
  }

  if (!task.start_time) {
    errors.start_time = 'Start time is required';
  }

  if (!task.end_date) {
    errors.end_date = 'End date is required';
  }

  if (!task.end_time) {
    errors.end_time = 'End time is required';
  }

  // Validate that end is after start
  if (task.start_date && task.end_date && task.start_time && task.end_time) {
    const startDateTime = new Date(`${task.start_date}T${task.start_time}`);
    const endDateTime = new Date(`${task.end_date}T${task.end_time}`);

    if (endDateTime <= startDateTime) {
      errors.endDateTime = 'End time must be after start time';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format task for API (ensure dates are in correct format)
 */
export const formatTaskForAPI = (task) => {
  return {
    title: task.title.trim(),
    description: task.description?.trim() || null,
    start_date: task.start_date,
    start_time: task.start_time,
    end_date: task.end_date,
    end_time: task.end_time,
  };
};

/**
 * Get task duration as human-readable string
 */
export const getTaskDurationString = (task) => {
  const startTime = task.start_time;
  const endTime = task.end_time;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Search tasks by title or description
 */
export const searchTasks = (tasks, query) => {
  if (!query || query.trim() === '') {
    return tasks;
  }

  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      (task.description && task.description.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Filter tasks by date range
 */
export const filterTasksByDateRange = (tasks, startDate, endDate) => {
  return tasks.filter((task) => {
    return (
      task.start_date >= startDate && task.start_date <= endDate
    );
  });
};

/**
 * Sort tasks by start time
 */
export const sortTasksByTime = (tasks) => {
  return [...tasks].sort((a, b) => {
    const timeA = a.start_time;
    const timeB = b.start_time;
    return timeA.localeCompare(timeB);
  });
};

/**
 * Get task summary for preview
 */
export const getTaskSummary = (task) => {
  const duration = getTaskDurationString(task);
  return `${task.title} (${task.start_time} - ${task.end_time}, ${duration})`;
};

/**
 * Check if task is in the past
 */
export const isTaskInPast = (task) => {
  const now = new Date();
  const endDateTime = new Date(`${task.end_date}T${task.end_time}`);
  return endDateTime < now;
};

/**
 * Check if task is currently happening
 */
export const isTaskHappening = (task) => {
  const now = new Date();
  const startDateTime = new Date(`${task.start_date}T${task.start_time}`);
  const endDateTime = new Date(`${task.end_date}T${task.end_time}`);
  return now >= startDateTime && now <= endDateTime;
};

/**
 * Get task status badge text
 */
export const getTaskStatus = (task) => {
  if (isTaskInPast(task)) {
    return 'Past';
  }
  if (isTaskHappening(task)) {
    return 'Active';
  }
  return 'Upcoming';
};
