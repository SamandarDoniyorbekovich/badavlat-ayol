import { Sample } from '../../types';
import { TABLE_CONFIG } from '../../config/constants';

export const generateRandomSamples = (count: number = 5): Sample[] => {
  const samples: Sample[] = [];
  const usedPositions = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    let positionKey: string;
    
    do {
      x = Math.floor(Math.random() * TABLE_CONFIG.WIDTH);
      y = Math.floor(Math.random() * TABLE_CONFIG.HEIGHT);
      positionKey = `${x},${y}`;
    } while (usedPositions.has(positionKey) || (x === 0 && y === 0)); // Avoid initial position
    
    usedPositions.add(positionKey);
    samples.push({
      id: `sample-${i + 1}`,
      x,
      y,
    });
  }
  
  return samples;
};
