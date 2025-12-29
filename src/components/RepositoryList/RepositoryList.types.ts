import type { Repository } from '../../types/feature.types';

export interface RepositoryListProps {
  repositories: Repository[];
  onEdit: (repository: Repository) => void;
  onDelete: (id: string) => void;
}
