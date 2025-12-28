import { useState, useCallback, useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { theme } from './theme/theme';
import { useFeatures } from './hooks/useFeatures';
import { useTags } from './hooks/useTags';
import FeatureList from './components/FeatureList';
import FeatureForm from './components/FeatureForm';
import SpeedDialActions from './components/SpeedDialActions';
import Footer from './components/Footer';
import ConfirmDialog from './components/ConfirmDialog';
import type { Feature } from './types/feature.types';
import type { FeatureFormData } from './components/FeatureForm/FeatureForm.types';

const REPOSITORY_URL = 'https://github.com/tiogars/features.tiogars.fr';

function App() {
  const { features, loading: featuresLoading, addFeature, updateFeature, removeFeature } = useFeatures();
  const { tags, addTag } = useTags();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const availableTags = useMemo(() => tags.map(t => t.name), [tags]);

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

  if (featuresLoading) {
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
            <Typography variant="h6" component="h1">
              Features Manager
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <FeatureList
            features={features}
            tags={tags}
            onEdit={handleEditFeature}
            onDelete={handleDeleteFeature}
            selectedTags={selectedTags}
            onTagFilterChange={setSelectedTags}
          />
        </Container>

        <Footer repositoryUrl={REPOSITORY_URL} />

        <SpeedDialActions onAddFeature={handleOpenForm} />

        <FeatureForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          initialData={editingFeature}
          availableTags={availableTags}
        />

        <ConfirmDialog
          open={confirmDialogOpen}
          title="Delete Feature"
          message="Are you sure you want to delete this feature? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
