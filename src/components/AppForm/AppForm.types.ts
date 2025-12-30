import type { Application, Repository, Link } from '../../types/feature.types';

export interface AppFormData {
  name: string;
  repositoryIds: string[];
  links: Link[];
}

export interface AppFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppFormData) => void;
  initialData?: Application;
  repositories: Repository[];
}
