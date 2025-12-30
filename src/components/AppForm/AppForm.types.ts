import type { Application, Repository } from '../../types/feature.types';

export interface AppFormData {
  name: string;
  repositoryIds: string[];
}

export interface AppFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppFormData) => void;
  initialData?: Application;
  repositories: Repository[];
}
