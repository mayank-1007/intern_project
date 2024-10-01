import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (params) => {
  const response = await axios.get('https://intern-project-backend-fgxq.onrender.com/api', { params });
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (task) => {
  const response = await axios.post('https://intern-project-backend-fgxq.onrender.com/api', task);
  return response.data;
});

export const assign = createAsyncThunk('/assign', async ({ memberId, taskIds }) => {
  const response = await axios.put(`https://intern-project-backend-fgxq.onrender.com/api/assign`, {memberId, taskIds});
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, task }) => {
  const response = await axios.put(`https://intern-project-backend-fgxq.onrender.com/api/${id}`, task);
  return response.data;
});
export const assignTask = createAsyncThunk('tasks/assignTask', async ({ id, email }) => {
  const response = await axios.put(`https://intern-project-backend-fgxq.onrender.com/api/addtask/${id}`, {id, email});
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await axios.delete(`https://intern-project-backend-fgxq.onrender.com/api/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index >= 0) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
