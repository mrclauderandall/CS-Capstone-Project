/**
 * userSlice.js
 * Defines a reducer that stores a global state for the react app.
 * Defines the logic for user related variables.
 */
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loaded: false,
    loggedIn: false,
    userDtls: {},
  },
  reducers: {
    login: (state, action) => {
      state.loaded = true;
      state.loggedIn = true;
      state.userDtls = action.payload;
    },
    logout: (state) => {
      state.loaded = true;
      state.loggedIn = false;
      state.userDtls = {};
    },
    load: (state) => {
      state.loaded = true;
    }
  },
})

export const { login, logout, load } = userSlice.actions;

export default userSlice.reducer;