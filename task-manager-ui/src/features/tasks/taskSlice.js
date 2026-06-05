import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from './taskThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedTask: null,
  searchQuery: '',
  filteredTasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilteredTasks: (state, action) => {
      state.filteredTasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.filteredTasks = [...state.items];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          state.filteredTasks = [...state.items];
        }
        state.selectedTask = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.filteredTasks = [...state.items];
        state.selectedTask = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedTask, clearError, setFilteredTasks } =
  taskSlice.actions;
export default taskSlice.reducer;
