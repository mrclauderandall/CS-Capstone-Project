/**
 * store.js
 * https://react-redux.js.org/tutorials/quick-start
 * Set up a redux store.
 * Redux is used to manage state for the frontend application.
 */
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './state/userSlice';

export default configureStore({
  reducer: {
    user: userReducer,
  },
})