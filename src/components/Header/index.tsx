import { Toolbar, Typography, Box } from '@mui/material';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import type { HeaderProps } from './Header.types';

const Header = ({ websiteName }: HeaderProps) => {
  return (
    <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
        <FeaturedPlayListIcon sx={{ fontSize: 32 }} />
        <Typography variant="h6" component="h1">
          {websiteName}
        </Typography>
      </Box>
    </Toolbar>
  );
};

export default Header;
