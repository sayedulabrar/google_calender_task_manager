import React, { useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { getTaskColor } from '../../utils/taskHelpers';
import { DATE_FORMATS } from '../../utils/constants';
import '../../styles/calendar.css';

/**
 * MonthView component - displays calendar in month grid using table structure
 */
export const MonthView = ({
  monthDays,
  currentDate,
  tasks,
  onDayClick,
  onTaskClick,
  onDateRangeSelect,
}) => {
  const [selection, setSelection] = useState(null);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDay = (date) => {
    const dateString = format(date, DATE_FORMATS.INPUT_DATE);
    return tasks.filter((task) => {
      const taskStart = new Date(`${task.start_date}T00:00:00`);
      const taskEnd = new Date(`${task.end_date}T23:59:59`);
      const dayStart = new Date(`${dateString}T00:00:00`);
      const dayEnd = new Date(`${dateString}T23:59:59`);

      return !(taskEnd < dayStart || taskStart > dayEnd);
    });
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const getSelectionBounds = () => {
    if (!selection) return null;

    const startTime = selection.startDate.getTime();
    const endTime = selection.endDate.getTime();

    return {
      start: startTime <= endTime ? selection.startDate : selection.endDate,
      end: startTime <= endTime ? selection.endDate : selection.startDate,
    };
  };

  const handleSelectionStart = (date) => {
    setSelection({ startDate: date, endDate: date });
  };

  const handleSelectionMove = (date) => {
    setSelection((currentSelection) =>
      currentSelection
        ? { ...currentSelection, endDate: date }
        : currentSelection
    );
  };

  const handleSelectionEnd = () => {
    const bounds = getSelectionBounds();

    if (bounds) {
      onDateRangeSelect?.({
        start_date: format(bounds.start, DATE_FORMATS.INPUT_DATE),
        end_date: format(bounds.end, DATE_FORMATS.INPUT_DATE),
      });
    }
  };

  const selectionBounds = getSelectionBounds();

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <table className="month-view-table">
      <tbody>
        <tr className="month-view-header-row">
          {weekDays.map((day) => (
            <td key={day} className="month-view-header-cell">
              {day}
            </td>
          ))}
        </tr>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              const isSelected =
                selectionBounds &&
                day >= selectionBounds.start &&
                day <= selectionBounds.end;

              return (
                <td
                  key={`${weekIndex}-${dayIndex}`}
                  className={`month-view-cell ${
                    !isCurrentMonth ? 'other-month' : ''
                  } ${today ? 'today' : ''} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onMouseDown={() => handleSelectionStart(day)}
                  onMouseEnter={() => handleSelectionMove(day)}
                  onMouseUp={handleSelectionEnd}
                  onClick={() => onDayClick(day)}
                >
                  <div className="month-view-cell-number">
                    {format(day, 'd')}
                  </div>

                  {dayTasks.length > 0 && (
                    <div className="month-view-cell-tasks">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="month-view-task"
                          style={{
                            backgroundColor: getTaskColor(task.id),
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                          }}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div
                          className="month-view-task overflow"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDayClick(day);
                          }}
                        >
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthView;
