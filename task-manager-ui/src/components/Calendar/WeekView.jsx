import React, { useEffect, useRef, useState } from 'react';
import { format, addMinutes, startOfDay } from 'date-fns';
import { getTaskColor } from '../../utils/taskHelpers';
import {
  getDisplayHourRange,
  getTimedTaskLayouts,
  minutesToTime,
  snapMinutes,
  timeToMinutes,
} from '../../utils/calendarHelpers';
import { DATE_FORMATS } from '../../utils/constants';
import '../../styles/calendar.css';

/**
 * WeekView component - displays timed tasks as single timeline blocks.
 */
export const WeekView = ({
  weekDays,
  currentDate,
  tasks,
  fitTimelineToTasks = false,
  onTaskClick,
  onTimeSlotClick,
  onTaskReschedule,
}) => {
  const daysRef = useRef(null);
  const [dragSnapMinutes, setDragSnapMinutes] = useState(60);
  const [dragState, setDragState] = useState(null);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDay = (date) => {
    const dateString = format(date, DATE_FORMATS.INPUT_DATE);
    return tasks.filter((task) => task.start_date === dateString);
  };

  const allTasksInWeek = tasks.filter((task) => {
    const taskDate = new Date(`${task.start_date}T00:00:00`);
    return weekDays.some(
      (day) =>
        format(day, DATE_FORMATS.INPUT_DATE) ===
        format(taskDate, DATE_FORMATS.INPUT_DATE)
    );
  });

  const { startHour, endHour } = getDisplayHourRange(
    allTasksInWeek,
    fitTimelineToTasks
  );
  const hours = Array.from({ length: endHour - startHour }).map(
    (_, i) => startHour + i
  );

  const getPointerMinutes = (clientY) => {
    const rect = daysRef.current?.getBoundingClientRect();
    if (!rect) return startHour * 60;

    const hourHeight = rect.height / (endHour - startHour);
    const rawMinutes =
      startHour * 60 + ((clientY - rect.top) / hourHeight) * 60;

    return Math.max(startHour * 60, Math.min(endHour * 60, rawMinutes));
  };

  const getPointerDayIndex = (clientX) => {
    const rect = daysRef.current?.getBoundingClientRect();
    if (!rect) return 0;

    const dayWidth = rect.width / weekDays.length;
    const rawDayIndex = Math.floor((clientX - rect.left) / dayWidth);

    return Math.max(0, Math.min(weekDays.length - 1, rawDayIndex));
  };

  const handleTaskDragStart = (event, task) => {
    event.preventDefault();
    event.stopPropagation();

    const durationMinutes = Math.max(
      timeToMinutes(task.end_time) - timeToMinutes(task.start_time),
      1
    );
    const originalStartMinutes = timeToMinutes(task.start_time);
    const pointerStartMinutes = getPointerMinutes(event.clientY);
    const originalDayIndex = weekDays.findIndex(
      (day) => format(day, DATE_FORMATS.INPUT_DATE) === task.start_date
    );

    setDragState({
      task,
      durationMinutes,
      originalStartMinutes,
      pointerStartMinutes,
      originalDayIndex: originalDayIndex === -1 ? 0 : originalDayIndex,
      previewStartMinutes: originalStartMinutes,
      previewDayIndex: originalDayIndex === -1 ? 0 : originalDayIndex,
      hasMoved: false,
    });
  };

  useEffect(() => {
    if (!dragState) return undefined;

    const handleMouseMove = (event) => {
      const pointerMinutes = getPointerMinutes(event.clientY);
      const snappedDelta = snapMinutes(
        pointerMinutes - dragState.pointerStartMinutes,
        dragSnapMinutes
      );
      const minStartMinutes = startHour * 60;
      const maxStartMinutes = endHour * 60 - dragState.durationMinutes;
      const previewStartMinutes = Math.max(
        minStartMinutes,
        Math.min(maxStartMinutes, dragState.originalStartMinutes + snappedDelta)
      );
      const previewDayIndex = getPointerDayIndex(event.clientX);

      setDragState((currentDragState) =>
        currentDragState
          ? {
              ...currentDragState,
              previewStartMinutes,
              previewDayIndex,
              hasMoved:
                currentDragState.hasMoved ||
                previewStartMinutes !== currentDragState.originalStartMinutes ||
                previewDayIndex !== currentDragState.originalDayIndex,
            }
          : currentDragState
      );
    };

    const handleMouseUp = () => {
      setDragState((currentDragState) => {
        if (!currentDragState) return null;

        if (currentDragState.hasMoved) {
          const targetDate = format(
            weekDays[currentDragState.previewDayIndex],
            DATE_FORMATS.INPUT_DATE
          );
          const startTime = minutesToTime(
            currentDragState.previewStartMinutes
          );
          const endTime = minutesToTime(
            currentDragState.previewStartMinutes +
              currentDragState.durationMinutes
          );

          onTaskReschedule?.(currentDragState.task, {
            start_date: targetDate,
            end_date: targetDate,
            start_time: startTime,
            end_time: endTime,
          });
        } else {
          onTaskClick(currentDragState.task);
        }

        return null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    dragSnapMinutes,
    dragState,
    endHour,
    onTaskClick,
    onTaskReschedule,
    startHour,
    weekDays,
  ]);

  return (
    <div className="week-view">
      <div className="week-view-toolbar">
        <label className="week-view-drag-snap">
          <span>Drag step</span>
          <select
            value={dragSnapMinutes}
            onChange={(event) => setDragSnapMinutes(Number(event.target.value))}
          >
            <option value={30}>0.5 hour</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={180}>3 hours</option>
            <option value={240}>4 hours</option>
          </select>
        </label>
      </div>

      <div className="week-view-header-row">
        <div className="week-view-time-header-cell" />
        {weekDays.map((day, index) => (
          <div key={index} className="week-view-day-header-cell">
            <div>{dayLabels[index]}</div>
            <div className="week-view-day-date">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="week-view-body">
        <div className="week-view-time-column">
          {hours.map((hour) => (
            <div key={hour} className="week-view-time-cell">
              {format(addMinutes(startOfDay(new Date()), hour * 60), 'ha')}
            </div>
          ))}
        </div>

        <div ref={daysRef} className="week-view-days">
          {weekDays.map((day, dayIndex) => {
            const dayTasks = getTasksForDay(day);
            const taskLayouts = getTimedTaskLayouts(
              dayTasks,
              startHour,
              endHour
            );

            return (
              <div key={dayIndex} className="week-view-day-column">
                {hours.map((hour) => (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className="week-view-day-cell"
                    onClick={() => onTimeSlotClick?.(day, hour)}
                  />
                ))}

                <div className="week-view-task-layer">
                  {dayTasks.map((task) => {
                    if (dragState?.task.id === task.id) {
                      return null;
                    }

                    const taskStart = new Date(
                      `${task.start_date}T${task.start_time}`
                    );
                    const taskEnd = new Date(
                      `${task.end_date}T${task.end_time}`
                    );

                    return (
                      <div
                        key={task.id}
                        className="week-view-task"
                        style={{
                          ...taskLayouts[task.id],
                          backgroundColor: getTaskColor(task.id),
                        }}
                        onMouseDown={(event) =>
                          handleTaskDragStart(event, task)
                        }
                        title={task.title}
                      >
                        <div className="global-view-task-title">{task.title}</div>
                        <div className="timed-task-time">
                          {format(taskStart, 'h:mm a')} - {format(taskEnd, 'h:mm a')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {dragState && (
            <div
              className="week-view-task week-view-task-drag-preview dragging"
              style={{
                top: `${
                  ((dragState.previewStartMinutes - startHour * 60) /
                    ((endHour - startHour) * 60)) *
                  100
                }%`,
                height: `${
                  (dragState.durationMinutes / ((endHour - startHour) * 60)) *
                  100
                }%`,
                left: `${(dragState.previewDayIndex / weekDays.length) * 100}%`,
                width: `${100 / weekDays.length}%`,
                backgroundColor: getTaskColor(dragState.task.id),
              }}
              title={dragState.task.title}
            >
              <div className="global-view-task-title">
                {dragState.task.title}
              </div>
              <div className="timed-task-time">
                {minutesToTime(dragState.previewStartMinutes)} -{' '}
                {minutesToTime(
                  dragState.previewStartMinutes + dragState.durationMinutes
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
