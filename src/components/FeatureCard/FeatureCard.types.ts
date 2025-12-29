import type { Feature } from '../../types/feature.types';

export interface FeatureCardProps {
  feature: Feature;
  tags: Array<{ id: string; name: string; color: string }>;
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
  onCreateIssue: (feature: Feature) => void;
}
