import { useState, useCallback } from 'react';
import {
  getMonthDays,
  getWeekDays,
  getDayHours,
  getYearCalendarData,
  getNextDate,
  getPreviousDate,
} from '../utils/dateHelpers';
import { generateTimeSlots } from '../utils/calendarHelpers';
import { VIEW_MODES, TIME_CONFIG } from '../utils/constants';

/**
 * Custom hook for calendar management
 */
export const useCalendar = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);

  const monthDays = useCallback(() => getMonthDays(currentDate), [currentDate]);
  const weekDays = useCallback(() => getWeekDays(currentDate), [currentDate]);
  const dayHours = useCallback(() => getDayHours(currentDate), [currentDate]);
  const timeSlots = useCallback(() => generateTimeSlots(), []);
  const yearData = useCallback(() => getYearCalendarData(currentDate), [currentDate]);

  const goToNextDate = useCallback((activeViewMode = viewMode) => {
    setCurrentDate((prev) => getNextDate(prev, activeViewMode));
  }, [viewMode]);

  const goToPreviousDate = useCallback((activeViewMode = viewMode) => {
    setCurrentDate((prev) => getPreviousDate(prev, activeViewMode));
  }, [viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToDate = useCallback((date) => {
    setCurrentDate(date);
  }, []);

  const changeViewMode = useCallback((mode) => {
    if (Object.values(VIEW_MODES).includes(mode)) {
      setViewMode(mode);
    }
  }, []);

  return {
    currentDate,
    viewMode,
    monthDays: monthDays(),
    weekDays: weekDays(),
    dayHours: dayHours(),
    timeSlots: timeSlots(),
    yearData: yearData(),
    goToNextDate,
    goToPreviousDate,
    goToToday,
    goToDate,
    changeViewMode,
  };
};
