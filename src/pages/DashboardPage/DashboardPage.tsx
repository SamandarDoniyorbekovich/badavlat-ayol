import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { logout } from '../../features/auth/authSlice';
import { executeNextCommand, resetTable, closeNotification } from '../../features/manipulator/manipulatorSlice';
import { ManipulatorTable } from '../../components/ManipulatorTable/ManipulatorTable';
import { CommandInput } from '../../components/CommandInput/CommandInput';
import { CommandHistory } from '../../components/CommandHistory/CommandHistory';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state: any) => state.auth);
  const { isExecuting, animationSpeed, notification } = useAppSelector(
    (state: any) => state.manipulator
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isExecuting) {
      interval = setInterval(() => {
        dispatch(executeNextCommand());
      }, animationSpeed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isExecuting, animationSpeed, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleResetTable = () => {
    dispatch(resetTable());
  };

  const handleCloseNotification = () => {
    dispatch(closeNotification());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Управление манипулятором
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Пользователь: {username}
          </Typography>
          <Button color="inherit" onClick={handleResetTable}>
            Сбросить стол
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ManipulatorTable />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CommandInput />
          </Grid>
          
          <Grid item xs={12}>
            <CommandHistory />
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
