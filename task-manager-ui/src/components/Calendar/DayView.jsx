import React, { useEffect, useRef, useState } from 'react';
import { format, addMinutes, startOfDay } from 'date-fns';
import { getTaskColor } from '../../utils/taskHelpers';
import {
  getDisplayHourRange,
  getTimedTaskLayouts,
  hourToTime,
  minutesToTime,
  snapMinutes,
  timeToMinutes,
} from '../../utils/calendarHelpers';
import { DATE_FORMATS } from '../../utils/constants';
import '../../styles/calendar.css';

/**
 * DayView component - displays timed tasks on a full-day timeline.
 */
export const DayView = ({
  currentDate,
  tasks,
  fitTimelineToTasks = false,
  onTaskClick,
  onTimeSlotClick,
  onTimeRangeSelect,
  onTaskReschedule,
}) => {
  const slotsRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [dragSnapMinutes, setDragSnapMinutes] = useState(60);
  const dateString = format(currentDate, DATE_FORMATS.INPUT_DATE);

  const dayTasks = tasks.filter((task) => {
    const taskStart = new Date(`${task.start_date}T00:00:00`);
    const taskEnd = new Date(`${task.end_date}T23:59:59`);
    const dayStart = new Date(`${dateString}T00:00:00`);
    const dayEnd = new Date(`${dateString}T23:59:59`);

    return !(taskEnd < dayStart || taskStart > dayEnd);
  });

  const { startHour, endHour } = getDisplayHourRange(
    dayTasks,
    fitTimelineToTasks
  );
  const hours = Array.from({ length: endHour - startHour }).map(
    (_, i) => startHour + i
  );
  const taskLayouts = getTimedTaskLayouts(dayTasks, startHour, endHour);

  const getPointerMinutes = (clientY) => {
    const rect = slotsRef.current?.getBoundingClientRect();
    if (!rect) return startHour * 60;

    const hourHeight = rect.height / (endHour - startHour);
    const rawMinutes =
      startHour * 60 + ((clientY - rect.top) / hourHeight) * 60;

    return Math.max(startHour * 60, Math.min(endHour * 60, rawMinutes));
  };

  const getSelectionBounds = () => {
    if (!selection) return null;

    return {
      start: Math.min(selection.startHour, selection.endHour),
      end: Math.max(selection.startHour, selection.endHour) + 1,
    };
  };

  const handleSelectionStart = (hour) => {
    setSelection({ startHour: hour, endHour: hour });
  };

  const handleSelectionMove = (hour) => {
    setSelection((currentSelection) =>
      currentSelection
        ? { ...currentSelection, endHour: hour }
        : currentSelection
    );
  };

  const handleSelectionEnd = () => {
    const bounds = getSelectionBounds();

    if (bounds) {
      onTimeRangeSelect?.({
        start_date: dateString,
        end_date: dateString,
        start_time: hourToTime(bounds.start),
        end_time: hourToTime(bounds.end),
      });
    }
  };

  const handleTaskDragStart = (event, task) => {
    event.preventDefault();
    event.stopPropagation();

    const durationMinutes = Math.max(
      timeToMinutes(task.end_time) - timeToMinutes(task.start_time),
      60
    );
    const originalStartMinutes = timeToMinutes(task.start_time);
    const pointerStartMinutes = getPointerMinutes(event.clientY);

    setSelection(null);
    setDragState({
      task,
      durationMinutes,
      originalStartMinutes,
      pointerStartMinutes,
      previewStartMinutes: originalStartMinutes,
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

      setDragState((currentDragState) =>
        currentDragState
          ? {
              ...currentDragState,
              previewStartMinutes,
              hasMoved:
                currentDragState.hasMoved ||
                previewStartMinutes !== currentDragState.originalStartMinutes,
            }
          : currentDragState
      );
    };

    const handleMouseUp = () => {
      setDragState((currentDragState) => {
        if (!currentDragState) return null;

        if (currentDragState.hasMoved) {
          const startTime = minutesToTime(currentDragState.previewStartMinutes);
          const endTime = minutesToTime(
            currentDragState.previewStartMinutes +
              currentDragState.durationMinutes
          );

          onTaskReschedule?.(currentDragState.task, {
            start_date: dateString,
            end_date: dateString,
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
    dateString,
    endHour,
    onTaskClick,
    onTaskReschedule,
    startHour,
  ]);

  const selectionBounds = getSelectionBounds();

  return (
    <div className="day-view">
      <div className="day-view-header-row">
        <div className="day-view-header-cell">
          <div className="day-view-header-date">{format(currentDate, 'EEEE')}</div>
          <div className="day-view-header-date">
            {format(currentDate, 'MMM d, yyyy')}
          </div>
        </div>
        <div className="day-view-header-content-cell">
          <label className="day-view-drag-snap">
            <span>Drag step</span>
            <select
              value={dragSnapMinutes}
              onChange={(event) =>
                setDragSnapMinutes(Number(event.target.value))
              }
            >
              <option value={30}>0.5 hour</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </label>
        </div>
      </div>

      <div className="day-view-body">
        <div className="day-view-time-column">
          {hours.map((hour) => (
            <div key={hour} className="day-view-time-cell">
              {format(addMinutes(startOfDay(new Date()), hour * 60), 'ha')}
            </div>
          ))}
        </div>

        <div
          ref={slotsRef}
          className="day-view-slots"
          onMouseUp={handleSelectionEnd}
        >
          {hours.map((hour) => {
            const isSelected =
              selectionBounds &&
              hour >= selectionBounds.start &&
              hour < selectionBounds.end;

            return (
              <div
                key={hour}
                className={`day-view-content-cell ${
                  isSelected ? 'selected' : ''
                }`}
                onMouseDown={() => handleSelectionStart(hour)}
                onMouseEnter={() => handleSelectionMove(hour)}
                onClick={() => onTimeSlotClick?.(currentDate, hour)}
              />
            );
          })}

          <div className="day-view-task-layer">
            {dayTasks.map((task) => {
              const taskStart = new Date(
                `${task.start_date}T${task.start_time}`
              );
              const taskEnd = new Date(`${task.end_date}T${task.end_time}`);
              const isDragging = dragState?.task.id === task.id;
              const layout = isDragging
                ? {
                    top: `${
                      ((dragState.previewStartMinutes - startHour * 60) /
                        ((endHour - startHour) * 60)) *
                      100
                    }%`,
                    height: `${
                      (dragState.durationMinutes /
                        ((endHour - startHour) * 60)) *
                      100
                    }%`,
                    left: taskLayouts[task.id]?.left,
                    width: taskLayouts[task.id]?.width,
                  }
                : taskLayouts[task.id];

              return (
                <div
                  key={task.id}
                  className={`day-view-task ${isDragging ? 'dragging' : ''}`}
                  style={{
                    ...layout,
                    backgroundColor: getTaskColor(task.id),
                  }}
                  onMouseDown={(event) => handleTaskDragStart(event, task)}
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
      </div>
    </div>
  );
};

export default DayView;
