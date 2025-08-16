import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sample, CommandHistory, TableState } from '../../types';
import { MANIPULATOR_CONFIG, TABLE_CONFIG } from '../../config/constants';
import { generateRandomSamples } from '../../shared/utils/sampleGenerator';
import { optimizeCommands, parseOptimizedCommands } from '../../shared/utils/commandOptimizer';

interface ManipulatorSliceState {
  table: TableState;
  commandHistory: CommandHistory[];
  isExecuting: boolean;
  currentCommandIndex: number;
  animationSpeed: number;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  };
}

const initialState: ManipulatorSliceState = {
  table: {
    width: TABLE_CONFIG.WIDTH,
    height: TABLE_CONFIG.HEIGHT,
    samples: generateRandomSamples(),
    manipulator: {
      x: MANIPULATOR_CONFIG.INITIAL_X,
      y: MANIPULATOR_CONFIG.INITIAL_Y,
      hasSample: false,
    },
  },
  commandHistory: [],
  isExecuting: false,
  currentCommandIndex: 0,
  animationSpeed: MANIPULATOR_CONFIG.ANIMATION_SPEED,
  notification: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const manipulatorSlice = createSlice({
  name: 'manipulator',
  initialState,
  reducers: {
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.animationSpeed = action.payload;
    },
    
    executeCommands: (state, action: PayloadAction<string>) => {
      const originalCommands = action.payload;
      const optimizedCommands = optimizeCommands(originalCommands);
      
      // Save current state for history
      const samplesBefore = [...state.table.samples];
      const manipulatorState = { ...state.table.manipulator };
      
      // Create history entry
      const historyEntry: CommandHistory = {
        id: Date.now().toString(),
        originalCommand: originalCommands,
        optimizedCommand: optimizedCommands,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        samplesBefore,
        samplesAfter: [...samplesBefore], // Will be updated after execution
        manipulatorState,
      };
      
      state.commandHistory.unshift(historyEntry);
      state.isExecuting = true;
      state.currentCommandIndex = 0;
    },
    
    executeNextCommand: (state) => {
      if (!state.isExecuting) return;
      
      const historyEntry = state.commandHistory[0];
      const optimizedCommands = historyEntry.optimizedCommand;
      const parsedCommands = parseOptimizedCommands(optimizedCommands);
      
      if (state.currentCommandIndex >= parsedCommands.length) {
        // Execution completed - update samplesAfter in history
        historyEntry.samplesAfter = [...state.table.samples];
        state.isExecuting = false;
        state.currentCommandIndex = 0;
        state.notification = {
          open: true,
          message: 'Команды успешно выполнены!',
          severity: 'success',
        };
        return;
      }
      
      const command = parsedCommands[state.currentCommandIndex];
      const manipulator = state.table.manipulator;
      
      switch (command) {
        case 'Л': // Left
          if (manipulator.x > 0) manipulator.x--;
          break;
        case 'П': // Right
          if (manipulator.x < state.table.width - 1) manipulator.x++;
          break;
        case 'В': // Up
          if (manipulator.y > 0) manipulator.y--;
          break;
        case 'Н': // Down
          if (manipulator.y < state.table.height - 1) manipulator.y++;
          break;
        case 'О': // Pick
          if (!manipulator.hasSample) {
            const sampleIndex = state.table.samples.findIndex(
              sample => sample.x === manipulator.x && sample.y === manipulator.y
            );
            if (sampleIndex !== -1) {
              state.table.samples.splice(sampleIndex, 1);
              manipulator.hasSample = true;
            }
          }
          break;
        case 'Б': // Drop
          if (manipulator.hasSample) {
            const newSample: Sample = {
              id: `sample-${Date.now()}`,
              x: manipulator.x,
              y: manipulator.y,
            };
            state.table.samples.push(newSample);
            manipulator.hasSample = false;
          }
          break;
      }
      
      state.currentCommandIndex++;
    },
    
    resetTable: (state) => {
      state.table.samples = generateRandomSamples();
      state.table.manipulator = {
        x: MANIPULATOR_CONFIG.INITIAL_X,
        y: MANIPULATOR_CONFIG.INITIAL_Y,
        hasSample: false,
      };
      state.isExecuting = false;
      state.currentCommandIndex = 0;
    },
    
    closeNotification: (state) => {
      state.notification.open = false;
    },
    
    clearHistory: (state) => {
      state.commandHistory = [];
    },
  },
});

export const {
  setAnimationSpeed,
  executeCommands,
  executeNextCommand,
  resetTable,
  closeNotification,
  clearHistory,
} = manipulatorSlice.actions;

export default manipulatorSlice.reducer;
