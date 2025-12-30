/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  FormHelperText,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import LinkForm from '../LinkForm';
import type { AppFormProps, AppFormData } from './AppForm.types';
import type { Link } from '../../types/feature.types';
import type { LinkFormData } from '../LinkForm/LinkForm.types';

const AppForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  repositories,
}: AppFormProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AppFormData>({
    defaultValues: {
      name: '',
      repositoryIds: [],
      links: [],
    },
  });

  const [links, setLinks] = useState<Link[]>([]);
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        repositoryIds: initialData.repositoryIds,
        links: initialData.links || [],
      });
      setLinks(initialData.links || []);
    } else {
      reset({
        name: '',
        repositoryIds: [],
        links: [],
      });
      setLinks([]);
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: AppFormData) => {
    onSubmit({
      ...data,
      links,
    });
    reset();
    setLinks([]);
  };

  const handleClose = () => {
    reset();
    setLinks([]);
    onClose();
  };

  const handleAddLink = () => {
    setEditingLink(undefined);
    setLinkFormOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setLinkFormOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter(l => l.id !== linkId));
  };

  const handleLinkFormSubmit = (data: LinkFormData) => {
    if (editingLink) {
      setLinks(links.map(l => 
        l.id === editingLink.id 
          ? { ...editingLink, ...data }
          : l
      ));
    } else {
      const newLink: Link = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      setLinks([...links, newLink]);
    }
    setLinkFormOpen(false);
    setEditingLink(undefined);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {initialData ? 'Edit App' : 'Add New App'}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'App name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="App Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message || 'Name of the application'}
                  autoFocus
                />
              )}
            />
            <Controller
              name="repositoryIds"
              control={control}
              rules={{ 
                required: 'At least one repository is required',
                validate: (value) => value.length > 0 || 'At least one repository is required'
              }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.repositoryIds}>
                  <InputLabel id="repositories-label">Repositories</InputLabel>
                  <Select
                    {...field}
                    labelId="repositories-label"
                    multiple
                    input={<OutlinedInput label="Repositories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const repo = repositories.find(r => r.id === value);
                          return repo ? (
                            <Chip key={value} label={`${repo.owner}/${repo.name}`} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {repositories.length === 0 ? (
                      <MenuItem disabled>No repositories available</MenuItem>
                    ) : (
                      repositories.map((repo) => (
                        <MenuItem key={repo.id} value={repo.id}>
                          {repo.owner}/{repo.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <FormHelperText>
                    {errors.repositoryIds?.message || 'Select repositories that belong to this app'}
                  </FormHelperText>
                </FormControl>
              )}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Links</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddLink}
                  size="small"
                >
                  Add Link
                </Button>
              </Box>
              
              {links.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No links added yet. Click "Add Link" to create one.
                </Typography>
              ) : (
                <List dense>
                  {links.map((link) => (
                    <ListItem
                      key={link.id}
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" size="small" onClick={() => handleEditLink(link)} sx={{ mr: 0.5 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton edge="end" size="small" onClick={() => handleDeleteLink(link.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={link.displayName}
                        secondary={
                          <>
                            {link.description} • {link.environment}
                            {link.href && (
                              <Typography variant="caption" display="block" sx={{ color: 'text.disabled' }}>
                                {link.href}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {initialData ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <LinkForm
        open={linkFormOpen}
        onClose={() => {
          setLinkFormOpen(false);
          setEditingLink(undefined);
        }}
        onSubmit={handleLinkFormSubmit}
        initialData={editingLink}
      />
    </>
  );
};

export default AppForm;
