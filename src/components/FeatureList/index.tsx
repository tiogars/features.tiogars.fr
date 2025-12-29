import { Box, Typography, Chip, Paper } from '@mui/material';
import FeatureCard from '../FeatureCard';
import type { FeatureListProps } from './FeatureList.types';

export default function FeatureList({
  features,
  tags,
  onEdit,
  onDelete,
  onCreateIssue,
  selectedTags,
  onTagFilterChange,
}: FeatureListProps) {
  const filteredFeatures = selectedTags.length > 0
    ? features.filter(feature =>
        selectedTags.every(tag => feature.tags.includes(tag))
      )
    : features;

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagFilterChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagFilterChange([...selectedTags, tagName]);
    }
  };

  return (
    <Box>
      {tags.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by tags:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => handleTagClick(tag.name)}
                sx={{
                  backgroundColor: selectedTags.includes(tag.name) ? tag.color : 'default',
                  color: selectedTags.includes(tag.name) ? '#fff' : 'text.primary',
                  '&:hover': {
                    backgroundColor: tag.color,
                    color: '#fff',
                    opacity: 0.8,
                  },
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {filteredFeatures.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No features yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the + button to create your first feature
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filteredFeatures.map((feature) => (
            <Box key={feature.id} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}>
              <FeatureCard
                feature={feature}
                tags={tags}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreateIssue={onCreateIssue}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
