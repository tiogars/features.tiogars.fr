import type { Feature } from '../../types/feature.types';

export interface FeatureListProps {
  features: Feature[];
  tags: Array<{ id: string; name: string; color: string }>;
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
  onCreateIssue: (feature: Feature) => void;
  selectedTags: string[];
  onTagFilterChange: (tags: string[]) => void;
}
