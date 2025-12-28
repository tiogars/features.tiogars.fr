import type { Feature } from '../../types/feature.types';

export interface FeatureFormData {
  title: string;
  description: string;
  tags: string[];
}

export interface FeatureFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FeatureFormData) => void;
  initialData?: Feature;
  availableTags: string[];
}
