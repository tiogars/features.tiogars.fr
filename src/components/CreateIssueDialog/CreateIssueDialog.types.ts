import type { Feature, Repository } from '../../types/feature.types';

export interface CreateIssueDialogProps {
  open: boolean;
  feature: Feature | null;
  repositories: Repository[];
  onClose: () => void;
  onCreateIssue: (repositoryId: string) => void;
}
