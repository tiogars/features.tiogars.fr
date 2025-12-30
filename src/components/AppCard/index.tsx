import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { AppCardProps } from './AppCard.types';

export default function AppCard({ app, repositories, onEdit, onDelete }: AppCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const appRepositories = repositories.filter(repo => app.repositoryIds.includes(repo.id));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {app.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {appRepositories.length} {appRepositories.length === 1 ? 'repository' : 'repositories'}
        </Typography>
        {appRepositories.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Repositories:
            </Typography>
            <List dense disablePadding>
              {appRepositories.map((repo) => (
                <ListItem key={repo.id} disablePadding sx={{ py: 0.5 }}>
                  <GitHubIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <ListItemText 
                    primary={`${repo.owner}/${repo.name}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">
          Updated: {formatDate(app.updatedAt)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(app)}
          aria-label="edit app"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(app.id)}
          aria-label="delete app"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
