import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';

/**
 * Компонент для отображения деталей выбранного репозитория
 */
const RepositoryDetails: React.FC = () => {
  const { selectedRepository } = useSelector((state: RootState) => state.search);

  if (!selectedRepository) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="textSecondary">
          Выберите репозиторий для просмотра деталей
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {selectedRepository.name}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          {selectedRepository.description || 'Описание отсутствует'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Лицензия: {selectedRepository.licenseInfo?.name || 'Не указана'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RepositoryDetails;