import { SpeedDial, SpeedDialAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import BackupIcon from '@mui/icons-material/Backup';
import type { SpeedDialActionsProps } from './SpeedDialActions.types';

const SpeedDialActions = ({ onAddFeature, onBackupRestore }: SpeedDialActionsProps) => {
  const actions = [
    { icon: <CreateIcon />, name: 'New Feature', onClick: onAddFeature },
  ];

  if (onBackupRestore) {
    actions.push({ icon: <BackupIcon />, name: 'Backup & Restore', onClick: onBackupRestore });
  }

  return (
    <SpeedDial
      ariaLabel="SpeedDial actions"
      sx={{ position: 'fixed', bottom: 80, right: 16 }}
      icon={<AddIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default SpeedDialActions;
