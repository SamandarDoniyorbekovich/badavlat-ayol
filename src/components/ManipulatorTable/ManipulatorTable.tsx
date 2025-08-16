import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TABLE_CONFIG } from '../../config/constants';

export const ManipulatorTable: React.FC = () => {
  const { table } = useAppSelector((state: any) => state.manipulator);
  const { samples, manipulator } = table;

  const renderCell = (x: number, y: number) => {
    const isManipulator = manipulator.x === x && manipulator.y === y;
    const sample = samples.find((s: any) => s.x === x && s.y === y);
    
    return (
      <Box
        key={`${x}-${y}`}
        sx={{
          width: TABLE_CONFIG.CELL_SIZE,
          height: TABLE_CONFIG.CELL_SIZE,
          border: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: isManipulator ? '#e3f2fd' : '#fff',
        }}
      >
        {isManipulator && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: manipulator.hasSample ? '#4caf50' : '#2196f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            {manipulator.hasSample ? 'M+O' : 'M'}
          </Box>
        )}
        
        {sample && !isManipulator && (
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          >
            O
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Стол манипулятора
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${TABLE_CONFIG.WIDTH}, ${TABLE_CONFIG.CELL_SIZE}px)`,
          gap: 0,
          border: '2px solid #333',
          width: 'fit-content',
        }}
      >
        {Array.from({ length: TABLE_CONFIG.HEIGHT }, (_, y) =>
          Array.from({ length: TABLE_CONFIG.WIDTH }, (_, x) => renderCell(x, y))
        )}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#2196f3',
            }}
          />
          <Typography variant="body2">Манипулятор</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#4caf50',
            }}
          />
          <Typography variant="body2">Манипулятор с образцом</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#ff9800',
            }}
          />
          <Typography variant="body2">Образец</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
