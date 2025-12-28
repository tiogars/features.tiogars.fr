import { SpeedDial, SpeedDialAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import type { SpeedDialActionsProps } from './SpeedDialActions.types';

export default function SpeedDialActions({ onAddFeature }: SpeedDialActionsProps) {
  const actions = [
    { icon: <CreateIcon />, name: 'New Feature', onClick: onAddFeature },
  ];

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
}
