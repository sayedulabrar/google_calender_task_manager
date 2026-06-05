// Color palette
export const COLORS = {
  PRIMARY: '#aedeaf',
  SECONDARY: '#a8d8ea',
  TERTIARY: '#fddb92',
  QUATERNARY: '#f7c6d4',
  QUINARY: '#d4a5a5',
  BACKGROUND: '#ffffff',
  LIGHT_BG: '#f5f5f5',
  TEXT_PRIMARY: '#202124',
  TEXT_SECONDARY: '#5f6368',
  BORDER: '#dadce0',
  ERROR: '#d33b27',
  SUCCESS: '#34a853',
};

// View modes
export const VIEW_MODES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Time configurations
export const TIME_CONFIG = {
  SLOT_DURATION_MINUTES: 30, // 30-minute slots
  BUSINESS_HOURS_START: 0, // 12 AM (midnight) - full 24-hour support
  BUSINESS_HOURS_END: 24, // 12 AM next day
  SNAP_TO_MINUTES: 15, // Snap drag to 15-minute intervals
};

// Task colors rotation
export const TASK_COLORS = [
  COLORS.PRIMARY,
  COLORS.SECONDARY,
  COLORS.TERTIARY,
  COLORS.QUATERNARY,
  COLORS.QUINARY,
];

// Date formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM d, yyyy',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATETIME: 'MMM d, yyyy h:mm a',
  INPUT_DATE: 'yyyy-MM-dd',
  INPUT_TIME: 'HH:mm',
  CALENDAR_HEADER: 'MMMM yyyy',
  MONTH_DAY: 'EEE d',
};

// API endpoints
export const API_ENDPOINTS = {
  TASKS: '/tasks',
};

// Toast messages
export const TOAST_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  TASK_CREATED_ERROR: 'Failed to create task',
  TASK_UPDATED_ERROR: 'Failed to update task',
  TASK_DELETED_ERROR: 'Failed to delete task',
  LOADING_ERROR: 'Failed to load tasks',
};
