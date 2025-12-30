import type { Link } from '../../types/feature.types';

export interface LinkFormData {
  displayName: string;
  description: string;
  icon: string;
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  environment: 'Production' | 'Test' | 'Development';
}

export interface LinkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LinkFormData) => void;
  initialData?: Link;
}
