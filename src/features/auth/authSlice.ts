import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AUTH_CONFIG } from '../../config/constants';

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  error: string | null;
}

const savedUsername = localStorage.getItem('username');
const savedPassword = localStorage.getItem('password');

const initialState: AuthState = {
  isAuthenticated: savedUsername === AUTH_CONFIG.USERNAME && savedPassword === AUTH_CONFIG.PASSWORD,
  username: savedUsername || '',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const { username, password } = action.payload;

      if (username === AUTH_CONFIG.USERNAME && password === AUTH_CONFIG.PASSWORD) {
        state.isAuthenticated = true;
        state.username = username;
        state.error = null;
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
      } else {
        state.error = 'Неверный логин или пароль';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.error = null;
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
