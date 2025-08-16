export const TABLE_CONFIG = {
  WIDTH: 10,
  HEIGHT: 8,
  CELL_SIZE: 60,
};

export const MANIPULATOR_CONFIG = {
  INITIAL_X: 0,
  INITIAL_Y: 0,
  ANIMATION_SPEED: 500, // milliseconds
};

export const AUTH_CONFIG = {
  USERNAME: 'admin',
  PASSWORD: 'admin',
};

export const COMMANDS = {
  LEFT: 'Л',
  RIGHT: 'П',
  UP: 'В',
  DOWN: 'Н',
  PICK: 'О',
  DROP: 'Б',
} as const;
