import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import manipulatorReducer from '../features/manipulator/manipulatorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    manipulator: manipulatorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
