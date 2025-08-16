import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { clearHistory } from '../../features/manipulator/manipulatorSlice';

export const CommandHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { commandHistory } = useAppSelector((state: any) => state.manipulator);

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  if (commandHistory.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          История команд
        </Typography>
        <Typography variant="body2" color="text.secondary">
          История команд пуста
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          История команд
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleClearHistory}
        >
          Очистить историю
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>Исходная команда</TableCell>
              <TableCell>Оптимизированная</TableCell>
              <TableCell>Образцы до</TableCell>
              <TableCell>Образцы после</TableCell>
              <TableCell>Позиция манипулятора</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commandHistory.map((entry: any) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.originalCommand}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={entry.optimizedCommand}
                    size="small"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  {entry.samplesBefore.length} шт.
                </TableCell>
                <TableCell>
                  {entry.samplesAfter.length} шт.
                </TableCell>
                <TableCell>
                  ({entry.manipulatorState.x}, {entry.manipulatorState.y})
                  {entry.manipulatorState.hasSample && ' + образец'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
