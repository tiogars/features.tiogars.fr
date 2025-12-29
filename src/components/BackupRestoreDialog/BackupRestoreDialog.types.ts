export interface BackupRestoreDialogProps {
  open: boolean;
  onClose: () => void;
}

export type BackupFormat = 'json' | 'xml' | 'csv';
