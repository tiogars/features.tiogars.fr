import { Box, Typography, Paper } from '@mui/material';
import AppCard from '../AppCard';
import type { AppListProps } from './AppList.types';

const AppList = ({ apps, repositories, onEdit, onDelete }: AppListProps) => {
  if (apps.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No apps added yet. Add your first app to organize your repositories!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {apps.map((app) => (
        <Box key={app.id} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}>
          <AppCard
            app={app}
            repositories={repositories}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Box>
      ))}
    </Box>
  );
};

export default AppList;
