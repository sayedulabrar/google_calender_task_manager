import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachDayOfInterval as eachDayInInterval,
  isSameDay,
  isSameMonth,
  format,
  parse,
  isWithinInterval,
  differenceInMinutes,
  addMinutes,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from 'date-fns';
import { DATE_FORMATS, VIEW_MODES } from './constants';

/**
 * Get all days in current month including padding days from prev/next month
 */
export const getMonthDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/**
 * Get all hours for a specific day (business hours)
 */
export const getDayHours = (date, startHour = 6, endHour = 22) => {
  const dayStart = startOfDay(date);
  const startTime = addMinutes(dayStart, startHour * 60);
  const endTime = addMinutes(dayStart, endHour * 60);

  return eachHourOfInterval({ start: startTime, end: endTime });
};

/**
 * Get all days in a week
 */
export const getWeekDays = (date) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Get all months in a year
 */
export const getYearMonths = (date) => {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);

  return eachMonthOfInterval({ start: yearStart, end: yearEnd });
};

/**
 * Get mini calendar data for a year (12 months)
 */
export const getYearCalendarData = (date) => {
  const months = getYearMonths(date);
  return months.map((month) => ({
    month: format(month, 'MMMM'),
    days: getMonthDays(month),
    date: month,
  }));
};

/**
 * Check if date is in current month
 */
export const isCurrentMonth = (date, monthDate) => {
  return isSameMonth(date, monthDate);
};

/**
 * Format date for display
 */
export const formatDate = (date, formatType = DATE_FORMATS.DISPLAY_DATE) => {
  return format(date, formatType);
};

/**
 * Format time for display
 */
export const formatTime = (date, formatType = DATE_FORMATS.DISPLAY_TIME) => {
  return format(date, formatType);
};

/**
 * Parse date string (yyyy-MM-dd)
 */
export const parseDate = (dateString) => {
  return parse(dateString, DATE_FORMATS.INPUT_DATE, new Date());
};

/**
 * Parse time string (HH:mm)
 */
export const parseTime = (timeString) => {
  const today = new Date();
  return parse(timeString, DATE_FORMATS.INPUT_TIME, today);
};

/**
 * Convert date + time to combined datetime
 */
export const combineDateAndTime = (dateString, timeString) => {
  const date = parseDate(dateString);
  const time = parseTime(timeString);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
};

/**
 * Check if task is on a specific day
 */
export const isTaskOnDay = (task, date) => {
  const taskStart = parseDate(task.start_date);
  const taskEnd = parseDate(task.end_date);
  return isWithinInterval(date, { start: taskStart, end: taskEnd });
};

/**
 * Get tasks that overlap with a time slot
 */
export const getOverlappingTasks = (tasks, date, startTime, endTime) => {
  return tasks.filter((task) => {
    const taskStart = combineDateAndTime(task.start_date, task.start_time);
    const taskEnd = combineDateAndTime(task.end_date, task.end_time);
    const slotStart = new Date(date);
    const slotEnd = new Date(slotStart);

    // Parse times and set on the slot date
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    slotStart.setHours(startHour, startMin, 0);
    slotEnd.setHours(endHour, endMin, 0);

    return !(taskEnd <= slotStart || taskStart >= slotEnd);
  });
};

/**
 * Calculate task duration in minutes
 */
export const getTaskDuration = (startDateTime, endDateTime) => {
  return differenceInMinutes(endDateTime, startDateTime);
};

/**
 * Calculate task height percentage for timeline view (0-100)
 */
export const getTaskHeightPercent = (startDateTime, endDateTime, slotStartTime, slotEndTime) => {
  const totalSlotMinutes = differenceInMinutes(slotEndTime, slotStartTime);
  const taskMinutes = differenceInMinutes(endDateTime, startDateTime);
  return (taskMinutes / totalSlotMinutes) * 100;
};

/**
 * Calculate task top position percentage
 */
export const getTaskTopPercent = (taskStart, slotStart, slotEnd) => {
  const totalSlotMinutes = differenceInMinutes(slotEnd, slotStart);
  const minutesFromStart = differenceInMinutes(taskStart, slotStart);
  return (minutesFromStart / totalSlotMinutes) * 100;
};

/**
 * Check if two dates are the same day
 */
export const areSameDay = (date1, date2) => {
  return isSameDay(date1, date2);
};

/**
 * Get next date
 */
export const getNextDate = (date, viewMode = VIEW_MODES.DAY) => {
  switch (viewMode) {
    case VIEW_MODES.WEEK:
      return addWeeks(date, 1);
    case VIEW_MODES.MONTH:
      return addMonths(date, 1);
    case VIEW_MODES.YEAR:
      return addYears(date, 1);
    case VIEW_MODES.DAY:
    default:
      return addDays(date, 1);
  }
};

/**
 * Get previous date
 */
export const getPreviousDate = (date, viewMode = VIEW_MODES.DAY) => {
  switch (viewMode) {
    case VIEW_MODES.WEEK:
      return subWeeks(date, 1);
    case VIEW_MODES.MONTH:
      return subMonths(date, 1);
    case VIEW_MODES.YEAR:
      return subYears(date, 1);
    case VIEW_MODES.DAY:
    default:
      return subDays(date, 1);
  }
};

/**
 * Get start of this week
 */
export const getWeekStart = (date) => {
  return startOfWeek(date);
};

/**
 * Get end of this week
 */
export const getWeekEnd = (date) => {
  return endOfWeek(date);
};
