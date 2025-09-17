import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePatient, usePatients } from '../../hooks/usePatients';
import type { PatientRecord } from '../../services/patientService';

const PatientsPage = () => {
  const navigate = useNavigate();
  const { data: patients = [], isLoading, isError } = usePatients();
  const createPatient = useCreatePatient();
  const [open, setOpen] = useState(false);
  const [displayId, setDisplayId] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async () => {
    try {
      if (!displayId.trim()) {
        setFormError('Identifier is required');
        return;
      }
      setFormError(null);
      const newId = await createPatient.mutateAsync({ displayId: displayId.trim(), notes });
      setDisplayId('');
      setNotes('');
      setOpen(false);
      navigate(`/patients/${newId}`);
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Patients & Subjects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize score sessions by patient identifier and revisit their history instantly.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>
          New patient
        </Button>
      </Box>

      {isError && <Alert severity="error">Could not load patients.</Alert>}

      <Grid container spacing={3}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} md={4} key={`skeleton-${index}`}>
              <PatientCard loading onOpen={() => undefined} />
            </Grid>
          ))}
        {!isLoading &&
          patients.map((patient) => (
            <Grid item xs={12} md={4} key={patient.id}>
              <PatientCard patient={patient} onOpen={() => navigate(`/patients/${patient.id}`)} />
            </Grid>
          ))}
        {!isLoading && patients.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">No patients yet. Create one to start tracking history.</Alert>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create patient / subject</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Identifier"
              value={displayId}
              onChange={(event) => setDisplayId(event.target.value)}
              helperText="MRN, initials, or study ID"
              required
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              helperText="Optional context for this patient or cohort"
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={createPatient.isPending}>
            {createPatient.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PatientCard = ({
  patient,
  loading,
  onOpen,
}: {
  patient?: PatientRecord;
  loading?: boolean;
  onOpen: () => void;
}) => {
  if (loading || !patient) {
    return (
      <Box
        sx={{
          border: '1px solid rgba(42, 127, 98, 0.12)',
          borderRadius: 3,
          height: 180,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1,
          background: 'rgba(255,255,255,0.6)',
        }}
      >
        <Typography variant="h6" sx={{ width: '70%', bgcolor: 'grey.200', borderRadius: 1 }}>
          &nbsp;
        </Typography>
        <Typography variant="body2" sx={{ width: '60%', bgcolor: 'grey.100', borderRadius: 1 }}>
          &nbsp;
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: '1px solid rgba(42, 127, 98, 0.12)',
        borderRadius: 3,
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="overline" color="text.secondary">
            Identifier
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
            {patient.displayId}
          </Typography>
        </Box>
        <IconButton onClick={onOpen} aria-label="Open history">
          <LaunchRoundedIcon />
        </IconButton>
      </Box>
      {patient.notes && (
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {patient.notes}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary">
        Last updated {patient.updatedAt.toLocaleDateString()} • Created{' '}
        {patient.createdAt.toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default PatientsPage;
