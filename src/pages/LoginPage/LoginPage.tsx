import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { login, clearError } from '../../features/auth/authSlice';
import { AUTH_CONFIG } from '../../config/constants';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state: any) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Pre-fill credentials for convenience
    setValue('username', AUTH_CONFIG.USERNAME);
    setValue('password', AUTH_CONFIG.PASSWORD);
  }, [setValue]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Вход в систему
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Управление манипулятором
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearError}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username', { required: 'Логин обязателен' })}
              label="Логин"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              {...register('password', { required: 'Пароль обязателен' })}
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                readOnly: true,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Войти
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Логин: {AUTH_CONFIG.USERNAME} | Пароль: {AUTH_CONFIG.PASSWORD}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
