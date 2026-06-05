import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from '../components/Header/Header';
import { SearchBar } from '../components/Search/SearchBar';
import { Calendar } from '../components/Calendar/Calendar';
import { TaskModal } from '../components/Task/TaskModal';
import { Spinner } from '../components/Common/Spinner';

import { useTasks } from '../hooks/useTasks';
import { useCalendar } from '../hooks/useCalendar';
import { useSearch } from '../hooks/useSearch';
import { selectTasksLoading, selectFilteredTasks } from '../features/tasks/taskSelectors';
import { VIEW_MODES } from '../utils/constants';

/**
 * Dashboard component - main page orchestrating all functionality
 */
const Dashboard = () => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskDefaults, setTaskDefaults] = useState(null);

  const calendar = useCalendar();
  const { tasks, loading, error, selectedTask, addTask, editTask, removeTask, selectTask } = useTasks();
  const { query, handleSearch, clearSearch } = useSearch();

  const filteredTasks = useSelector(selectFilteredTasks);
  const tasksLoading = useSelector(selectTasksLoading);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle create task button click
  const handleCreateTaskClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Handle task click
  const handleTaskClick = (task) => {
    setTaskDefaults(null);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle task form submit
  const handleTaskSubmit = async (formData) => {
    if (editingTask) {
      // Update existing task
      const result = await editTask(editingTask.id, formData);
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setEditingTask(null);
        setTaskDefaults(null);
      } else {
        toast.error(result.message);
      }
    } else {
      // Create new task
      const result = await addTask(formData);
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setTaskDefaults(null);
      } else {
        toast.error(result.message);
      }
    }
  };

  // Handle delete task (with confirmation)
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await removeTask(taskId);
      if (result.success) {
        toast.success(result.message);
        setIsModalOpen(false);
        setEditingTask(null);
        setTaskDefaults(null);
      } else {
        toast.error(result.message);
      }
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTaskDefaults(null);
  };

  const handleTimeRangeSelect = (range) => {
    setTaskDefaults((currentDefaults) => ({
      ...currentDefaults,
      ...range,
    }));
  };

  const handleDateRangeSelect = (range) => {
    setTaskDefaults((currentDefaults) => ({
      ...currentDefaults,
      ...range,
    }));
  };

  const handleTaskReschedule = async (task, scheduleUpdates) => {
    const result = await editTask(task.id, {
      title: task.title,
      description: task.description || '',
      start_date: scheduleUpdates.start_date,
      start_time: scheduleUpdates.start_time,
      end_date: scheduleUpdates.end_date,
      end_time: scheduleUpdates.end_time,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Handle view change
  const handleViewChange = (newViewMode) => {
    if (newViewMode === VIEW_MODES.YEAR) {
      clearSearch();
    }

    setViewMode(newViewMode);
  };

  return (
    <div className="dashboard">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

        <Header
          currentDate={calendar.currentDate}
          viewMode={viewMode}
          onPreviousClick={() => calendar.goToPreviousDate(viewMode)}
          onNextClick={() => calendar.goToNextDate(viewMode)}
          onTodayClick={calendar.goToToday}
          onViewChange={handleViewChange}
          onCreateTaskClick={handleCreateTaskClick}
      />

      <div className="dashboard-content">
        {viewMode !== VIEW_MODES.YEAR && (
          <div className="dashboard-search">
            <SearchBar
              value={query}
              onChange={handleSearch}
              onClear={clearSearch}
            />
          </div>
        )}

        {tasksLoading ? (
          <Spinner message="Loading tasks..." />
        ) : (
          <Calendar
            tasks={filteredTasks}
            currentDate={calendar.currentDate}
            viewMode={viewMode}
            isSearchActive={query.trim().length > 0}
            onTaskClick={handleTaskClick}
            onDateChange={calendar.goToDate}
            onTimeRangeSelect={handleTimeRangeSelect}
            onDateRangeSelect={handleDateRangeSelect}
            onTaskReschedule={handleTaskReschedule}
          />
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleTaskSubmit}
        // Pass the delete handler here
        onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
        initialTask={editingTask}
        taskDefaults={!editingTask ? taskDefaults : null}
        loading={tasksLoading}
      />
    </div>
  );
};

export default Dashboard;
