import type { Application, Repository } from '../../types/feature.types';

export interface AppCardProps {
  app: Application;
  repositories: Repository[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}
