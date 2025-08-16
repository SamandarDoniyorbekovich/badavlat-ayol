export interface User {
  username: string;
  password: string;
}

export interface Sample {
  id: string;
  x: number;
  y: number;
}

export interface ManipulatorState {
  x: number;
  y: number;
  hasSample: boolean;
}

export interface CommandHistory {
  id: string;
  originalCommand: string;
  optimizedCommand: string;
  date: string;
  time: string;
  samplesBefore: Sample[];
  samplesAfter: Sample[];
  manipulatorState: ManipulatorState;
}

export interface TableState {
  width: number;
  height: number;
  samples: Sample[];
  manipulator: ManipulatorState;
}

export type Direction = 'Л' | 'П' | 'В' | 'Н';
export type Action = 'О' | 'Б';
export type Command = Direction | Action;

export interface OptimizedCommand {
  count?: number;
  command: Command;
  subCommands?: OptimizedCommand[];
}
