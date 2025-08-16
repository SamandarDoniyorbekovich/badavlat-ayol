import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Slider,
  Chip,
} from '@mui/material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { executeCommands, setAnimationSpeed } from '../../features/manipulator/manipulatorSlice';
import { optimizeCommands } from '../../shared/utils/commandOptimizer';
import { COMMANDS } from '../../config/constants';

interface CommandFormData {
  commands: string;
}

export const CommandInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const { animationSpeed, isExecuting, table } = useAppSelector((state: any) => state.manipulator);
  const { manipulator } = table;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CommandFormData>();

  const commands = watch('commands', '');

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    dispatch(setAnimationSpeed(newValue as number));
  };

  const addCommand = (command: string) => {
    const currentCommands = commands;
    setValue('commands', currentCommands + command);
  };

  const clearCommands = () => {
    setValue('commands', '');
  };

  const onSubmit = (data: CommandFormData) => {
    if (data.commands.trim()) {
      dispatch(executeCommands(data.commands));
      reset(); // Clear form after submission
    }
  };

  const optimizedCommands = optimizeCommands(commands);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ввод команд
      </Typography>

      <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Текущая позиция манипулятора: ({manipulator.x}, {manipulator.y})
          {manipulator.hasSample && ' + образец'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('commands', { required: 'Введите команды' })}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          error={!!errors.commands}
          helperText={errors.commands?.message}
          placeholder="Пример: ЛЛЛЛВВПППОНННБ"
        />

        {commands && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Оптимизированная версия:
            </Typography>
            <Chip
              label={optimizedCommands}
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Быстрые команды:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(COMMANDS).map(([key, value]) => (
              <Button
                key={key}
                variant="outlined"
                size="small"
                onClick={() => addCommand(value)}
                disabled={isExecuting}
              >
                {value}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={clearCommands}
              disabled={isExecuting}
              color="error"
            >
              Очистить
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Скорость анимации: {animationSpeed}мс
          </Typography>
          <Slider
            value={animationSpeed}
            onChange={handleSpeedChange}
            min={100}
            max={2000}
            step={100}
            marks
            valueLabelDisplay="auto"
            disabled={isExecuting}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={isExecuting || !commands.trim()}
        >
          {isExecuting ? 'Выполняется...' : 'Отправить команды'}
        </Button>
      </Box>
    </Paper>
  );
};
