import React from 'react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { YearView } from './YearView';
import {
  getMonthDays,
  getWeekDays,
  getYearCalendarData,
} from '../../utils/dateHelpers';
import { VIEW_MODES } from '../../utils/constants';
import '../../styles/calendar.css';

/**
 * Main Calendar component - orchestrates all view modes
 */
export const Calendar = ({
  tasks = [],
  currentDate = new Date(),
  viewMode = VIEW_MODES.MONTH,
  isSearchActive = false,
  onViewChange,
  onTaskClick,
  onDateChange,
  onTimeRangeSelect,
  onDateRangeSelect,
  onTaskReschedule,
}) => {
  const handleDayClick = (date) => {
    onDateChange?.(date);
  };

  const renderView = () => {
    switch (viewMode) {
      case VIEW_MODES.MONTH:
        return (
          <MonthView
            monthDays={getMonthDays(currentDate)}
            currentDate={currentDate}
            tasks={tasks}
            onDayClick={handleDayClick}
            onTaskClick={onTaskClick}
            onDateRangeSelect={onDateRangeSelect}
          />
        );

      case VIEW_MODES.WEEK:
        return (
          <WeekView
            weekDays={getWeekDays(currentDate)}
            currentDate={currentDate}
            tasks={tasks}
            fitTimelineToTasks={isSearchActive}
            onTaskClick={onTaskClick}
            onTimeSlotClick={(date, hour) => {
              handleDayClick(date);
            }}
            onTaskReschedule={onTaskReschedule}
          />
        );

      case VIEW_MODES.DAY:
        return (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            fitTimelineToTasks={isSearchActive}
            onTaskClick={onTaskClick}
            onTimeSlotClick={() => {}}
            onTimeRangeSelect={onTimeRangeSelect}
            onTaskReschedule={onTaskReschedule}
          />
        );

      case VIEW_MODES.YEAR:
        return (
          <YearView
            yearData={getYearCalendarData(currentDate)}
            tasks={tasks}
            onMonthClick={(date) => {
              onDateChange?.(date);
            }}
            onTaskClick={handleDayClick}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="calendar-container">
      {renderView()}
    </div>
  );
};

export default Calendar;
