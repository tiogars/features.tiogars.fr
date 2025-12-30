import { useState, useCallback, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import { theme } from './theme/theme';
import { useFeatures } from './hooks/useFeatures';
import { useTags } from './hooks/useTags';
import { useRepositories } from './hooks/useRepositories';
import FeatureList from './components/FeatureList';
import FeatureForm from './components/FeatureForm';
import RepositoryList from './components/RepositoryList';
import RepositoryForm from './components/RepositoryForm';
import CreateIssueDialog from './components/CreateIssueDialog';
import SpeedDialActions from './components/SpeedDialActions';
import Footer from './components/Footer';
import ConfirmDialog from './components/ConfirmDialog';
import BackupRestoreDialog from './components/BackupRestoreDialog';
import type { Feature, Repository } from './types/feature.types';
import type { FeatureFormData } from './components/FeatureForm/FeatureForm.types';
import type { RepositoryFormData } from './components/RepositoryForm/RepositoryForm.types';
import { parseGitHubUrl, findExistingRepository } from './utils/github';

const REPOSITORY_URL = 'https://github.com/tiogars/features.tiogars.fr';

// Route configuration for tab navigation
const ROUTES = {
  FEATURES: '/',
  REPOSITORIES: '/repositories',
} as const;

const ROUTE_TO_TAB_INDEX = {
  [ROUTES.FEATURES]: 0,
  [ROUTES.REPOSITORIES]: 1,
} as const;

const TAB_INDEX_TO_ROUTE = [ROUTES.FEATURES, ROUTES.REPOSITORIES] as const;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { features, loading: featuresLoading, addFeature, updateFeature, removeFeature } = useFeatures();
  const { tags, addTag } = useTags();
  const { repositories, loading: repositoriesLoading, addRepository, updateRepository, removeRepository } = useRepositories();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);
  const [repositoryFormOpen, setRepositoryFormOpen] = useState(false);
  const [editingRepository, setEditingRepository] = useState<Repository | undefined>(undefined);
  const [repositoryToDelete, setRepositoryToDelete] = useState<string | null>(null);
  const [repositoryConfirmDialogOpen, setRepositoryConfirmDialogOpen] = useState(false);
  const [createIssueDialogOpen, setCreateIssueDialogOpen] = useState(false);
  const [featureForIssue, setFeatureForIssue] = useState<Feature | null>(null);
  const [backupRestoreDialogOpen, setBackupRestoreDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const availableTags = useMemo(() => tags.map(t => t.name), [tags]);

  // Handle shared URLs from Web Share Target API
  useEffect(() => {
    const handleSharedUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedUrl = urlParams.get('url');
      const sharedTitle = urlParams.get('title');
      
      // Sanitize title to prevent XSS - remove potentially dangerous characters
      const sanitizedTitle = sharedTitle 
        ? sharedTitle.replace(/[<>"'`&]/g, '').substring(0, 100) 
        : '';
      
      if (sharedUrl) {
        // Parse the GitHub URL
        const repoInfo = parseGitHubUrl(sharedUrl);
        
        if (repoInfo) {
          // Check if repository already exists
          const exists = findExistingRepository(repositories, repoInfo.owner, repoInfo.name);
          
          if (!exists) {
            // Create the repository
            try {
              await addRepository({
                name: repoInfo.name,
                owner: repoInfo.owner,
                url: repoInfo.url,
              });
              
              setSnackbarMessage(`Repository "${repoInfo.owner}/${repoInfo.name}" added successfully!`);
              setSnackbarSeverity('success');
              setSnackbarOpen(true);
              
              // Navigate to repository page to show the new repository
              navigate(ROUTES.REPOSITORIES);
            } catch (error) {
              console.error('Error adding repository:', error);
              setSnackbarMessage('Failed to add repository');
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
            }
          } else {
            setSnackbarMessage(`Repository "${repoInfo.owner}/${repoInfo.name}" already exists`);
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            
            // Navigate to repository page to show existing repositories
            navigate(ROUTES.REPOSITORIES);
          }
        } else {
          // Not a GitHub URL or invalid format
          setSnackbarMessage(sanitizedTitle ? `Received: ${sanitizedTitle}` : 'Invalid GitHub URL format');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
        
        // Clean up URL parameters while preserving hash
        const newUrl = new URL(window.location.href);
        newUrl.search = '';
        window.history.replaceState({}, document.title, newUrl.pathname + newUrl.hash);
      }
    };
    
    // Only run when repositories are loaded
    if (!repositoriesLoading) {
      handleSharedUrl();
    }
  }, [repositories, repositoriesLoading, addRepository, navigate]);

  const handleOpenForm = useCallback(() => {
    setEditingFeature(undefined);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingFeature(undefined);
  }, []);

  const handleSubmitForm = useCallback(async (data: FeatureFormData) => {
    // Add new tags if they don't exist
    for (const tagName of data.tags) {
      await addTag(tagName);
    }

    if (editingFeature) {
      await updateFeature(editingFeature.id, {
        title: data.title,
        description: data.description,
        tags: data.tags,
      });
    } else {
      await addFeature({
        title: data.title,
        description: data.description,
        tags: data.tags,
      });
    }

    handleCloseForm();
  }, [editingFeature, addFeature, updateFeature, addTag, handleCloseForm]);

  const handleEditFeature = useCallback((feature: Feature) => {
    setEditingFeature(feature);
    setFormOpen(true);
  }, []);

  const handleDeleteFeature = useCallback(async (id: string) => {
    setFeatureToDelete(id);
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (featureToDelete) {
      await removeFeature(featureToDelete);
      setFeatureToDelete(null);
    }
    setConfirmDialogOpen(false);
  }, [featureToDelete, removeFeature]);

  const handleCancelDelete = useCallback(() => {
    setFeatureToDelete(null);
    setConfirmDialogOpen(false);
  }, []);

  const handleOpenRepositoryForm = useCallback(() => {
    setEditingRepository(undefined);
    setRepositoryFormOpen(true);
  }, []);

  const handleCloseRepositoryForm = useCallback(() => {
    setRepositoryFormOpen(false);
    setEditingRepository(undefined);
  }, []);

  const handleSubmitRepositoryForm = useCallback(async (data: RepositoryFormData) => {
    if (editingRepository) {
      await updateRepository(editingRepository.id, {
        name: data.name,
        owner: data.owner,
        url: data.url,
      });
    } else {
      await addRepository({
        name: data.name,
        owner: data.owner,
        url: data.url,
      });
    }
    handleCloseRepositoryForm();
  }, [editingRepository, addRepository, updateRepository, handleCloseRepositoryForm]);

  const handleEditRepository = useCallback((repository: Repository) => {
    setEditingRepository(repository);
    setRepositoryFormOpen(true);
  }, []);

  const handleDeleteRepository = useCallback((id: string) => {
    setRepositoryToDelete(id);
    setRepositoryConfirmDialogOpen(true);
  }, []);

  const handleConfirmDeleteRepository = useCallback(async () => {
    if (repositoryToDelete) {
      await removeRepository(repositoryToDelete);
      setRepositoryToDelete(null);
    }
    setRepositoryConfirmDialogOpen(false);
  }, [repositoryToDelete, removeRepository]);

  const handleCancelDeleteRepository = useCallback(() => {
    setRepositoryToDelete(null);
    setRepositoryConfirmDialogOpen(false);
  }, []);

  const handleCreateIssue = useCallback((feature: Feature) => {
    setFeatureForIssue(feature);
    setCreateIssueDialogOpen(true);
  }, []);

  const handleCloseCreateIssueDialog = useCallback(() => {
    setCreateIssueDialogOpen(false);
    setFeatureForIssue(null);
  }, []);

  const handleConfirmCreateIssue = useCallback((repositoryId: string) => {
    const repository = repositories.find(r => r.id === repositoryId);
    if (repository && featureForIssue) {
      // Create GitHub issue URL with pre-filled data
      const issueTitle = encodeURIComponent(featureForIssue.title);
      const issueBody = encodeURIComponent(featureForIssue.description);
      const issueUrl = `https://github.com/${repository.owner}/${repository.name}/issues/new?title=${issueTitle}&body=${issueBody}`;
      
      // Open in new tab
      window.open(issueUrl, '_blank', 'noopener,noreferrer');
    }
    handleCloseCreateIssueDialog();
  }, [repositories, featureForIssue, handleCloseCreateIssueDialog]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    // Navigate based on tab index using centralized route mapping
    // Fallback to FEATURES route if newValue is out of bounds
    const targetRoute = newValue >= 0 && newValue < TAB_INDEX_TO_ROUTE.length 
      ? TAB_INDEX_TO_ROUTE[newValue]
      : ROUTES.FEATURES;
    navigate(targetRoute);
  }, [navigate]);

  const handleOpenBackupRestoreDialog = useCallback(() => {
    setBackupRestoreDialogOpen(true);
  }, []);

  const handleCloseBackupRestoreDialog = useCallback(() => {
    setBackupRestoreDialogOpen(false);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Determine current tab based on route using centralized mapping
  // Defaults to 0 (Features tab) for unknown routes
  const getTabIndex = (pathname: string): number => {
    return pathname in ROUTE_TO_TAB_INDEX 
      ? ROUTE_TO_TAB_INDEX[pathname as keyof typeof ROUTE_TO_TAB_INDEX]
      : 0;
  };
  const currentTab = getTabIndex(location.pathname);

  if (featuresLoading || repositoriesLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Features Manager
            </Typography>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ backgroundColor: 'primary.dark' }}
          >
            <Tab label="Features" />
            <Tab label="Repository Management" />
          </Tabs>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Routes>
            <Route path={ROUTES.FEATURES} element={
              <FeatureList
                features={features}
                tags={tags}
                onEdit={handleEditFeature}
                onDelete={handleDeleteFeature}
                onCreateIssue={handleCreateIssue}
                selectedTags={selectedTags}
                onTagFilterChange={setSelectedTags}
              />
            } />
            <Route path={ROUTES.REPOSITORIES} element={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    Repositories
                  </Typography>
                  <Box>
                    <SpeedDialActions onAddFeature={handleOpenRepositoryForm} />
                  </Box>
                </Box>
                <RepositoryList
                  repositories={repositories}
                  onEdit={handleEditRepository}
                  onDelete={handleDeleteRepository}
                />
              </Box>
            } />
          </Routes>
        </Container>

        <Footer repositoryUrl={REPOSITORY_URL} />

        {currentTab === 0 && <SpeedDialActions onAddFeature={handleOpenForm} onBackupRestore={handleOpenBackupRestoreDialog} />}

        <FeatureForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          initialData={editingFeature}
          availableTags={availableTags}
        />

        <RepositoryForm
          open={repositoryFormOpen}
          onClose={handleCloseRepositoryForm}
          onSubmit={handleSubmitRepositoryForm}
          initialData={editingRepository}
        />

        <CreateIssueDialog
          open={createIssueDialogOpen}
          feature={featureForIssue}
          repositories={repositories}
          onClose={handleCloseCreateIssueDialog}
          onCreateIssue={handleConfirmCreateIssue}
        />

        <ConfirmDialog
          open={confirmDialogOpen}
          title="Delete Feature"
          message="Are you sure you want to delete this feature? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <ConfirmDialog
          open={repositoryConfirmDialogOpen}
          title="Delete Repository"
          message="Are you sure you want to delete this repository? This action cannot be undone."
          onConfirm={handleConfirmDeleteRepository}
          onCancel={handleCancelDeleteRepository}
        />

        <BackupRestoreDialog
          open={backupRestoreDialogOpen}
          onClose={handleCloseBackupRestoreDialog}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
