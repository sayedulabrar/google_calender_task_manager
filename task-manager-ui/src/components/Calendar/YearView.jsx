import React from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { getTaskColor } from '../../utils/taskHelpers';
import { DATE_FORMATS } from '../../utils/constants';
import '../../styles/calendar.css';

/**
 * YearView component - displays all 12 months in a grid
 */
export const YearView = ({
  yearData,
  tasks,
  onMonthClick,
  onTaskClick,
}) => {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getTasksForDay = (date) => {
    const dateString = format(date, DATE_FORMATS.INPUT_DATE);
    return tasks.filter((task) => task.start_date === dateString);
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const hasTasksOnDay = (date) => {
    return getTasksForDay(date).length > 0;
  };

  return (
    <div className="year-view">
      {yearData.map((monthData, monthIndex) => (
        <div
          key={monthIndex}
          className="year-view-month"
          onClick={() => onMonthClick(monthData.date)}
        >
          <div className="year-view-month-header">
            {monthData.month}
          </div>

          <div className="year-view-mini-calendar">
            {/* Day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="year-view-mini-day"
                style={{
                  fontWeight: 'bold',
                  backgroundColor: 'var(--light-bg)',
                }}
              >
                {day}
              </div>
            ))}

            {/* Days */}
            {monthData.days.map((day, index) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentMonth = isSameMonth(day, monthData.date);
              const today = isToday(day);

              return (
                <div
                  key={index}
                  className={`year-view-mini-day ${
                    !isCurrentMonth ? 'other-month' : ''
                  } ${today ? 'today' : ''} ${
                    hasTasksOnDay(day) ? 'has-tasks' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick?.(day);
                  }}
                  title={dayTasks.length > 0 ? `${dayTasks.length} task(s)` : ''}
                  style={{
                    position: 'relative',
                  }}
                >
                  {format(day, 'd')}
                  {hasTasksOnDay(day) && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: getTaskColor(dayTasks[0].id),
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearView;
