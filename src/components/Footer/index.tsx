import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';
import type { FooterProps } from './Footer.types';

export default function Footer({ repositoryUrl }: FooterProps) {
  const issueUrl = `${repositoryUrl}/issues/new`;

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
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Built with React + TypeScript + MUI
          </Typography>
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
}
