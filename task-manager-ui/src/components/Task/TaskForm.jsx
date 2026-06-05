import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DATE_FORMATS } from '../../utils/constants';
import '../../styles/tasks.css';

/**
 * TaskForm component for creating and editing tasks
 */
export const TaskForm = ({
  initialTask,
  taskDefaults,
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
}) => {
  const getDefaultFormData = () => ({
    title: '',
    description: '',
    start_date:
      taskDefaults?.start_date || format(new Date(), DATE_FORMATS.INPUT_DATE),
    start_time: taskDefaults?.start_time || '09:00',
    end_date:
      taskDefaults?.end_date || format(new Date(), DATE_FORMATS.INPUT_DATE),
    end_time: taskDefaults?.end_time || '10:00',
  });

  const [formData, setFormData] = useState(getDefaultFormData);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        start_date: initialTask.start_date,
        start_time: initialTask.start_time,
        end_date: initialTask.end_date,
        end_time: initialTask.end_time,
      });
    } else {
      setFormData(getDefaultFormData());
    }
  }, [initialTask, taskDefaults]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    // Check if end is after start
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_time &&
      formData.end_time
    ) {
      const startDt = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDt = new Date(`${formData.end_date}T${formData.end_time}`);

      if (endDt <= startDt) {
        newErrors.endDateTime = 'End time must be after start time';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength="255"
          disabled={loading}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start_date">Start Date *</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.start_date && (
            <span className="error-message">{errors.start_date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="start_time">Start Time *</label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.start_time && (
            <span className="error-message">{errors.start_time}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="end_date">End Date *</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.end_date && (
            <span className="error-message">{errors.end_date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="end_time">End Time *</label>
          <input
            type="time"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.end_time && (
            <span className="error-message">{errors.end_time}</span>
          )}
        </div>
      </div>

      {errors.endDateTime && (
        <div className="error-message form-error">
          {errors.endDateTime}
        </div>
      )}

      <div className="form-actions">
        {initialTask && onDelete && (
          <button
            type="button"
            className="btn btn--danger btn--md"
            onClick={onDelete}
            disabled={loading}
          >
            Delete Task
          </button>
        )}
        <button
          type="button"
          className="btn btn--secondary btn--md"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary btn--md"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
