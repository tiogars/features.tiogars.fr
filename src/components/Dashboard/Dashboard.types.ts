import type { Feature, Repository, Application, Tag } from '../../types/feature.types';

export interface DashboardProps {
  features: Feature[];
  repositories: Repository[];
  apps: Application[];
  tags: Tag[];
  onCreateFeature: () => void;
  onCreateRepository: () => void;
  onCreateApp: () => void;
  onEditFeature: (feature: Feature) => void;
  onEditApp: (app: Application) => void;
  onDeleteFeature: (id: string) => void;
  onDeleteApp: (id: string) => void;
  onCreateIssue: (feature: Feature) => void;
}
