import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        isLoggedIn: false,
    },
    reducers: {
        setUser: (state, action) => {
            console.log(action.payload);
            state.userInfo = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
        },
        store: (state, action) => {
            return action.payload; // Update user state with payload
        },
    },
});

export const { setUser, logout, store } = userSlice.actions;
export default userSlice.reducer;
