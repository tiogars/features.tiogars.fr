import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FeatureCardProps } from './FeatureCard.types';

export default function FeatureCard({ feature, tags, onEdit, onDelete }: FeatureCardProps) {
  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#808080';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {feature.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {feature.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {feature.tags.map((tagName) => (
            <Chip
              key={tagName}
              label={tagName}
              size="small"
              sx={{
                backgroundColor: getTagColor(tagName),
                color: '#fff',
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          Updated: {formatDate(feature.updatedAt)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(feature)}
          aria-label="edit feature"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(feature.id)}
          aria-label="delete feature"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
