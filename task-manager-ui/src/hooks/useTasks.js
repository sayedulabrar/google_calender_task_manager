import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../features/tasks/taskThunks';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectSelectedTask,
} from '../features/tasks/taskSelectors';
import { setSelectedTask, clearError } from '../features/tasks/taskSlice';
import { formatTaskForAPI, validateTask } from '../utils/taskHelpers';
import { TOAST_MESSAGES } from '../utils/constants';

/**
 * Custom hook for task management and API operations
 */
export const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const selectedTask = useSelector(selectSelectedTask);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const addTask = async (taskData) => {
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: Object.values(validation.errors)[0],
      };
    }

    const formattedData = formatTaskForAPI(taskData);
    const result = await dispatch(createTask(formattedData));

    if (result.payload) {
      return {
        success: true,
        message: TOAST_MESSAGES.TASK_CREATED,
      };
    } else {
      return {
        success: false,
        message: result.payload || TOAST_MESSAGES.TASK_CREATED_ERROR,
      };
    }
  };

  const editTask = async (taskId, taskData) => {
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: Object.values(validation.errors)[0],
      };
    }

    const formattedData = formatTaskForAPI(taskData);
    const result = await dispatch(
      updateTask({ taskId, taskData: formattedData })
    );

    if (result.payload) {
      return {
        success: true,
        message: TOAST_MESSAGES.TASK_UPDATED,
      };
    } else {
      return {
        success: false,
        message: result.payload || TOAST_MESSAGES.TASK_UPDATED_ERROR,
      };
    }
  };

  const removeTask = async (taskId) => {
    const result = await dispatch(deleteTask(taskId));

    if (deleteTask.fulfilled.match(result)) {
      return {
        success: true,
        message: TOAST_MESSAGES.TASK_DELETED,
      };
    }

    return {
      success: false,
      message: result.payload || TOAST_MESSAGES.TASK_DELETED_ERROR,
    };
  };

  const selectTask = (task) => {
    dispatch(setSelectedTask(task));
  };

  const deselectTask = () => {
    dispatch(setSelectedTask(null));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    tasks,
    loading,
    error,
    selectedTask,
    addTask,
    editTask,
    removeTask,
    selectTask,
    deselectTask,
    clearError: handleClearError,
  };
};
