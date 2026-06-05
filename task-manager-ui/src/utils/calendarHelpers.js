import { TIME_CONFIG } from './constants';
import { addMinutes, format } from 'date-fns';

/**
 * Generate time slots for a day (e.g., 6:00 AM, 6:30 AM, 7:00 AM, etc.)
 */
export const generateTimeSlots = (
  startHour = TIME_CONFIG.BUSINESS_HOURS_START,
  endHour = TIME_CONFIG.BUSINESS_HOURS_END,
  slotDuration = TIME_CONFIG.SLOT_DURATION_MINUTES
) => {
  const slots = [];
  const date = new Date();
  date.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, 0, 0, 0);

  while (date < endTime) {
    slots.push(format(date, 'HH:mm'));
    date.setMinutes(date.getMinutes() + slotDuration);
  }

  return slots;
};

/**
 * Get tasks grouped by day
 */
export const groupTasksByDay = (tasks) => {
  const grouped = {};

  tasks.forEach((task) => {
    if (!grouped[task.start_date]) {
      grouped[task.start_date] = [];
    }
    grouped[task.start_date].push(task);
  });

  return grouped;
};

/**
 * Get tasks grouped by week
 */
export const groupTasksByWeek = (tasks, weekDays) => {
  const grouped = {};
  const dayStrings = weekDays.map((d) => format(d, 'yyyy-MM-dd'));

  dayStrings.forEach((day) => {
    grouped[day] = [];
  });

  tasks.forEach((task) => {
    // Check if task falls within this week
    dayStrings.forEach((day) => {
      if (task.start_date === day) {
        grouped[day].push(task);
      }
    });
  });

  return grouped;
};

/**
 * Get column width for overlapping tasks
 */
export const getOverlapColumns = (tasks, date) => {
  // Sort tasks by start time
  const sorted = [...tasks].sort((a, b) => {
    const timeA = a.start_time;
    const timeB = b.start_time;
    return timeA.localeCompare(timeB);
  });

  // Assign column positions
  const columns = {};
  let maxColumn = 0;

  sorted.forEach((task) => {
    let columnIndex = 0;

    // Find first available column
    for (let i = 0; i <= maxColumn; i++) {
      const taskInColumn = sorted.find((t) => columns[t.id] === i);
      if (
        !taskInColumn ||
        !tasksOverlap(task, taskInColumn)
      ) {
        columnIndex = i;
        break;
      }
    }

    columns[task.id] = columnIndex;
    maxColumn = Math.max(maxColumn, columnIndex);
  });

  return { columns, totalColumns: maxColumn + 1 };
};

/**
 * Check if two tasks overlap in time
 */
export const tasksOverlap = (task1, task2) => {
  const start1 = `${task1.start_date}T${task1.start_time}`;
  const end1 = `${task1.end_date}T${task1.end_time}`;
  const start2 = `${task2.start_date}T${task2.start_time}`;
  const end2 = `${task2.end_date}T${task2.end_time}`;

  const dt1Start = new Date(start1);
  const dt1End = new Date(end1);
  const dt2Start = new Date(start2);
  const dt2End = new Date(end2);

  return !(dt1End <= dt2Start || dt1Start >= dt2End);
};

/**
 * Get all overlapping task groups for a day
 */
export const getOverlapGroups = (tasksForDay) => {
  const groups = [];
  const used = new Set();

  tasksForDay.forEach((task) => {
    if (used.has(task.id)) return;

    const group = [task];
    used.add(task.id);

    tasksForDay.forEach((otherTask) => {
      if (!used.has(otherTask.id) && tasksOverlap(task, otherTask)) {
        group.push(otherTask);
        used.add(otherTask.id);
      }
    });

    groups.push(group);
  });

  return groups;
};

export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) => {
  const clampedMinutes = Math.max(0, Math.min(24 * 60 - 1, minutes));
  const hours = Math.floor(clampedMinutes / 60);
  const mins = clampedMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const snapMinutes = (minutes, snapAmount) => {
  return Math.round(minutes / snapAmount) * snapAmount;
};

export const hourToTime = (hour) => {
  if (hour >= 24) {
    return '23:59';
  }

  return `${String(hour).padStart(2, '0')}:00`;
};

const getTaskStartMinutes = (task) => timeToMinutes(task.start_time);
const getTaskEndMinutes = (task) => timeToMinutes(task.end_time);

const getMaxOverlapCount = (task, tasks) => {
  const taskStart = getTaskStartMinutes(task);
  const taskEnd = getTaskEndMinutes(task);
  const boundaries = new Set([taskStart, taskEnd]);

  tasks.forEach((otherTask) => {
    const otherStart = getTaskStartMinutes(otherTask);
    const otherEnd = getTaskEndMinutes(otherTask);

    if (otherEnd > taskStart && otherStart < taskEnd) {
      boundaries.add(Math.max(otherStart, taskStart));
      boundaries.add(Math.min(otherEnd, taskEnd));
    }
  });

  const sortedBoundaries = [...boundaries].sort((a, b) => a - b);
  let maxOverlap = 1;

  for (let i = 0; i < sortedBoundaries.length - 1; i += 1) {
    const segmentStart = sortedBoundaries[i];
    const segmentEnd = sortedBoundaries[i + 1];

    if (segmentEnd <= segmentStart) continue;

    const overlapCount = tasks.filter((otherTask) => {
      const otherStart = getTaskStartMinutes(otherTask);
      const otherEnd = getTaskEndMinutes(otherTask);
      return otherEnd > segmentStart && otherStart < segmentEnd;
    }).length;

    maxOverlap = Math.max(maxOverlap, overlapCount);
  }

  return maxOverlap;
};

const getTaskColumn = (task, tasks, maxColumns) => {
  const taskStart = getTaskStartMinutes(task);
  const taskEnd = getTaskEndMinutes(task);
  const usedColumns = new Set();

  tasks
    .filter((otherTask) => {
      if (otherTask.id === task.id) return false;

      const otherStart = getTaskStartMinutes(otherTask);
      const otherEnd = getTaskEndMinutes(otherTask);

      return otherEnd > taskStart && otherStart < taskEnd;
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .forEach((otherTask) => {
      if (otherTask.__layoutColumn !== undefined) {
        usedColumns.add(otherTask.__layoutColumn);
      }
    });

  for (let column = 0; column < maxColumns; column += 1) {
    if (!usedColumns.has(column)) {
      return column;
    }
  }

  return 0;
};

/**
 * Calculate single-block timeline placement for timed tasks.
 */
export const getTimedTaskLayouts = (tasks, startHour, endHour) => {
  const timelineStart = startHour * 60;
  const timelineEnd = endHour * 60;
  const timelineMinutes = timelineEnd - timelineStart;
  const layouts = {};
  const tasksWithColumns = [...tasks]
    .sort((a, b) => {
      const startCompare = a.start_time.localeCompare(b.start_time);
      if (startCompare !== 0) return startCompare;

      return b.end_time.localeCompare(a.end_time);
    })
    .map((task) => ({ ...task }));

  tasksWithColumns.forEach((task) => {
    const maxColumns = getMaxOverlapCount(task, tasksWithColumns);
    const column = getTaskColumn(task, tasksWithColumns, maxColumns);
    task.__layoutColumn = column;

    const startMinutes = Math.max(getTaskStartMinutes(task), timelineStart);
    const endMinutes = Math.min(getTaskEndMinutes(task), timelineEnd);
    const top = ((startMinutes - timelineStart) / timelineMinutes) * 100;
    const height = Math.max(
      ((endMinutes - startMinutes) / timelineMinutes) * 100,
      2
    );
    const width = 100 / maxColumns;

    layouts[task.id] = {
      top: `${top}%`,
      height: `${height}%`,
      left: `${column * width}%`,
      width: `${width}%`,
    };
  });

  return layouts;
};

/**
 * Sort tasks by start time and date
 */
export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    const dateCompare = a.start_date.localeCompare(b.start_date);
    if (dateCompare !== 0) return dateCompare;
    return a.start_time.localeCompare(b.start_time);
  });
};

/**
 * Get visible tasks for a specific day in week/day view
 */
export const getVisibleTasksForDay = (tasks, date, dateString) => {
  return tasks.filter((task) => task.start_date === dateString);
};

/**
 * Get the timeline range for day/week views.
 */
export const getDisplayHourRange = (tasksForDay = [], fitToTasks = false) => {
  if (!fitToTasks || tasksForDay.length === 0) {
    return {
      startHour: TIME_CONFIG.BUSINESS_HOURS_START,
      endHour: TIME_CONFIG.BUSINESS_HOURS_END,
    };
  }

  let minHour = TIME_CONFIG.BUSINESS_HOURS_END;
  let maxHour = TIME_CONFIG.BUSINESS_HOURS_START;

  tasksForDay.forEach((task) => {
    const startHour = parseInt(task.start_time.split(':')[0], 10);
    const endHour = parseInt(task.end_time.split(':')[0], 10);

    minHour = Math.min(minHour, startHour);
    maxHour = Math.max(maxHour, endHour + 1);
  });

  minHour = Math.max(
    TIME_CONFIG.BUSINESS_HOURS_START,
    Math.floor(minHour / 2) * 2
  );
  maxHour = Math.min(
    TIME_CONFIG.BUSINESS_HOURS_END,
    Math.ceil(maxHour / 2) * 2
  );

  return {
    startHour: minHour,
    endHour: maxHour,
  };
};

/**
 * Check if a time slot is within business hours
 */
export const isBusinessHours = (hour) => {
  return (
    hour >= TIME_CONFIG.BUSINESS_HOURS_START &&
    hour < TIME_CONFIG.BUSINESS_HOURS_END
  );
};
