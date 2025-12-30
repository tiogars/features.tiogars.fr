import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FeaturesIcon from '@mui/icons-material/Lightbulb';
import RepositoryIcon from '@mui/icons-material/Folder';
import AppsIcon from '@mui/icons-material/Apps';
import BackupIcon from '@mui/icons-material/Backup';
import FeatureCard from '../FeatureCard';
import AppCard from '../AppCard';
import type { DashboardProps } from './Dashboard.types';
import { getLastBackupTimestamp } from '../../utils/backup';

const Dashboard = ({
  features,
  repositories,
  apps,
  tags,
  onCreateFeature,
  onCreateRepository,
  onCreateApp,
  onEditFeature,
  onEditApp,
  onDeleteFeature,
  onDeleteApp,
  onCreateIssue,
}: DashboardProps) => {
  const lastBackupTimestamp = getLastBackupTimestamp();

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get top 3 recently updated items for each entity
  const recentFeatures = [...features]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  const recentApps = [...apps]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  const recentRepositories = [...repositories]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FeaturesIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Features
              </Typography>
            </Box>
            <Typography variant="h3" component="div" color="primary">
              {features.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total features
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RepositoryIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Repositories
              </Typography>
            </Box>
            <Typography variant="h3" component="div" color="secondary">
              {repositories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total repositories
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AppsIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Apps
              </Typography>
            </Box>
            <Typography variant="h3" component="div" color="success.main">
              {apps.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total applications
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BackupIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Last Backup
              </Typography>
            </Box>
            <Typography variant="body1" component="div" color="text.primary" sx={{ mt: 1 }}>
              {formatDate(lastBackupTimestamp)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Backup status
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onCreateFeature}
          >
            Create Feature
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={onCreateRepository}
          >
            Add Repository
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={onCreateApp}
          >
            Create App
          </Button>
        </Box>
      </Paper>

      {/* Recent Features */}
      {recentFeatures.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 2
          }}>
            {recentFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                tags={tags}
                onEdit={onEditFeature}
                onDelete={onDeleteFeature}
                onCreateIssue={onCreateIssue}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Recent Apps */}
      {recentApps.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Apps
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 2
          }}>
            {recentApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                repositories={repositories}
                onEdit={onEditApp}
                onDelete={onDeleteApp}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Recent Repositories */}
      {recentRepositories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Repositories
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 2
          }}>
            {recentRepositories.map((repo) => (
              <Card key={repo.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RepositoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" component="h3">
                      {repo.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {repo.owner}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {formatDate(repo.updatedAt)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state */}
      {features.length === 0 && repositories.length === 0 && apps.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Welcome to Features Manager!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Get started by creating your first feature, repository, or app using the quick actions above.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
