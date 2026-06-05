import { useState, useCallback } from 'react';
import { TIME_CONFIG } from '../utils/constants';

/**
 * Custom hook for drag and drop handling
 */
export const useDragDrop = () => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((taskData, event) => {
    setDraggedTask(taskData);

    // Store initial offset for smooth dragging
    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    // Set drag image
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('taskData', JSON.stringify(taskData));
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event, onTaskDrop) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const taskData = event.dataTransfer.getData('taskData');
      if (taskData && onTaskDrop) {
        const task = JSON.parse(taskData);
        const dropX = event.clientX;
        const dropY = event.clientY;

        onTaskDrop(task, { x: dropX, y: dropY });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, []);

  const snapToInterval = useCallback(
    (time, snapMinutes = TIME_CONFIG.SNAP_TO_MINUTES) => {
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const snappedMinutes = Math.round(totalMinutes / snapMinutes) * snapMinutes;

      const snappedHours = Math.floor(snappedMinutes / 60) % 24;
      const snappedMins = snappedMinutes % 60;

      return `${String(snappedHours).padStart(2, '0')}:${String(snappedMins).padStart(2, '0')}`;
    },
    []
  );

  return {
    draggedTask,
    dragOffset,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    snapToInterval,
  };
};
