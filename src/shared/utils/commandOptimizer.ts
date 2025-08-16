import { Command, OptimizedCommand } from '../../types';

export const optimizeCommands = (commands: string): string => {
  if (!commands) return '';
  
  const commandArray = commands.split('').filter(cmd => cmd.trim());
  const optimized: OptimizedCommand[] = [];
  
  let i = 0;
  while (i < commandArray.length) {
    const current = commandArray[i] as Command;
    
    if (current === 'О' || current === 'Б') {
      optimized.push({ command: current });
      i++;
    } else {
      let count = 1;
      while (i + count < commandArray.length && commandArray[i + count] === current) {
        count++;
      }
      
      if (count > 1) {
        optimized.push({ count, command: current });
      } else {
        optimized.push({ command: current });
      }
      
      i += count;
    }
  }
  
  return optimized.map(cmd => {
    if (cmd.count && cmd.count > 1) {
      return `${cmd.count}${cmd.command}`;
    }
    return cmd.command;
  }).join('');
};

export const parseOptimizedCommands = (optimizedCommands: string): Command[] => {
  const commands: Command[] = [];
  let i = 0;
  
  while (i < optimizedCommands.length) {
    const char = optimizedCommands[i];
    
    if (char === 'О' || char === 'Б') {
      commands.push(char as Command);
      i++;
    } else if (/\d/.test(char)) {
      let count = '';
      while (i < optimizedCommands.length && /\d/.test(optimizedCommands[i])) {
        count += optimizedCommands[i];
        i++;
      }
      
      if (i < optimizedCommands.length) {
        const command = optimizedCommands[i] as Command;
        const repeatCount = parseInt(count);
        for (let j = 0; j < repeatCount; j++) {
          commands.push(command);
        }
        i++;
      }
    } else {
      commands.push(char as Command);
      i++;
    }
  }
  
  return commands;
};
