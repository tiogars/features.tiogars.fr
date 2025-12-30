import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';
import type { FooterProps } from './Footer.types';

const Footer = ({ repositoryUrl }: FooterProps) => {
  const issueUrl = `${repositoryUrl}/issues/new`;
  const currentYear = new Date().getFullYear();
  const inceptionYear = 2025;
  const copyrightYear = inceptionYear === currentYear 
    ? `${inceptionYear}` 
    : `${inceptionYear}-${currentYear}`;

  const poweredByLinks = [
    { name: 'React', url: 'https://react.dev/' },
    { name: 'Vite', url: 'https://vite.dev/' },
    { name: 'MUI', url: 'https://mui.com/' },
    { name: 'React Router', url: 'https://reactrouter.com/' },
    { name: 'React Hook Form', url: 'https://react-hook-form.com/' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" color="text.secondary">
            © {copyrightYear} Features Manager
          </Typography>

          {/* Powered by links */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Powered by:
            </Typography>
            {poweredByLinks.map((lib, index) => (
              <Box key={lib.name} sx={{ display: 'flex', alignItems: 'center' }}>
                <Link
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.secondary"
                  underline="hover"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {lib.name}
                </Link>
                {index < poweredByLinks.length - 1 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                    •
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* GitHub links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component={Link}
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component={Link}
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Report Issue"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <BugReportIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
