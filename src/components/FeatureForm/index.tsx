import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { FeatureFormProps, FeatureFormData } from './FeatureForm.types';

const FeatureForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  availableTags,
}: FeatureFormProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FeatureFormData>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        tags: initialData.tags,
      });
    } else {
      reset({
        title: '',
        description: '',
        tags: [],
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: FeatureFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Feature' : 'Create New Feature'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                autoFocus
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                freeSolo
                options={availableTags}
                value={field.value}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    margin="normal"
                    helperText="Press Enter to add new tags"
                  />
                )}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FeatureForm;
