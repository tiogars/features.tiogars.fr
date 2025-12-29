import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { RepositoryListProps } from './RepositoryList.types';

export default function RepositoryList({ repositories, onEdit, onDelete }: RepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No repositories added yet. Add your first repository to start creating issues!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {repositories.map((repository, index) => (
          <ListItem
            key={repository.id}
            divider={index < repositories.length - 1}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <GitHubIcon color="action" />
            </Box>
            <ListItemText
              primary={`${repository.owner}/${repository.name}`}
              secondary={repository.url}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit(repository)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(repository.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
