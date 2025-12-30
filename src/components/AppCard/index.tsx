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
  ListItemIcon,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import type { AppCardProps } from './AppCard.types';

const AppCard = ({ app, repositories, onEdit, onDelete }: AppCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const appRepositories = repositories.filter(repo => app.repositoryIds.includes(repo.id));
  const appLinks = app.links || [];

  const getEnvironmentColor = (env: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (env) {
      case 'Production':
        return 'success';
      case 'Test':
        return 'warning';
      case 'Development':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {app.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {appRepositories.length} {appRepositories.length === 1 ? 'repository' : 'repositories'}
          {appLinks.length > 0 && ` • ${appLinks.length} ${appLinks.length === 1 ? 'link' : 'links'}`}
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
        {appLinks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Links:
            </Typography>
            <List dense disablePadding>
              {appLinks.map((link) => (
                <ListItem key={link.id} disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {link.icon ? <LinkIcon fontSize="small" /> : <LaunchIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MuiLink 
                          href={link.href} 
                          target={link.target}
                          rel="noopener noreferrer"
                          variant="body2"
                          sx={{ textDecoration: 'none' }}
                        >
                          {link.displayName}
                        </MuiLink>
                        <Chip 
                          label={link.environment} 
                          size="small" 
                          color={getEnvironmentColor(link.environment)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={link.description}
                    secondaryTypographyProps={{ variant: 'caption' }}
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
};

export default AppCard;
