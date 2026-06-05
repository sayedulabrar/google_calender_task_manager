import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Fetch all tasks
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

/**
 * Create a new task
 */
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

/**
 * Update an existing task
 */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.TASKS}/${taskId}`,
        taskData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

/**
 * Delete a task
 */
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_ENDPOINTS.TASKS}/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);
