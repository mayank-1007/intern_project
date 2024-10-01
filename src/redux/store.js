import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: taskReducer,
    },
});
