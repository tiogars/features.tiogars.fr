import type { Repository } from '../../types/feature.types';

export interface RepositoryFormData {
  name: string;
  owner: string;
  url: string;
}

export interface RepositoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RepositoryFormData) => void;
  initialData?: Repository;
}
