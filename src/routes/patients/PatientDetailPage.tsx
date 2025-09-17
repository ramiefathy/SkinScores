import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../../hooks/usePatients';
import { usePatientSessions } from '../../hooks/usePatientSessions';
import { useSessionResults } from '../../hooks/useSessionResults';
import { useResultExport } from '../../hooks/useResultExport';
import type { ScoreSessionRecord } from '../../services/scoreSessionService';
import { buildExportFilename, formatResultForClipboard } from '../../utils/resultFormatting';

const PatientDetailPage = () => {
  const { patientId = '' } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: sessions = [], isLoading: sessionsLoading } = usePatientSessions(patientId);
  const sessionIds = useMemo(() => sessions.map((session) => session.id), [sessions]);
  const { data: results = [] } = useSessionResults(sessionIds);
  const exportMutation = useResultExport();
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSessionIds([]);
    setExportSuccess(null);
    setExportError(null);
  }, [patientId]);

  const latestSessions = useMemo(() => sessions.slice(0, 1), [sessions]);
  const latestResult = latestSessions.length
    ? results.find((result) => result.sessionId === latestSessions[0].id)
    : undefined;

  const handleToggleSession = (sessionId: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId],
    );
  };

  const handleCopy = async (session: ScoreSessionRecord) => {
    const result = results.find((res) => res.sessionId === session.id);
    if (!result) {
      setExportError('No result available to copy.');
      return;
    }
    const text = formatResultForClipboard({
      result,
      templateName: session.templateName,
    });
    try {
      await navigator.clipboard.writeText(text);
      setExportSuccess('Copied result to clipboard.');
      setExportError(null);
    } catch (error) {
      setExportError((error as Error).message);
    }
  };

  const handleDownload = async (formatType: 'text' | 'csv') => {
    if (selectedSessionIds.length === 0) {
      setExportError('Select at least one session to export.');
      return;
    }
    try {
      setExportError(null);
      const data = await exportMutation.mutateAsync(selectedSessionIds);
      const payload = formatType === 'csv' ? data.csv : data.text;
      const blob = new Blob([payload], {
        type: formatType === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildExportFilename(patient?.displayId, formatType);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess('Export ready for download.');
    } catch (error) {
      setExportError((error as Error).message);
    }
  };

  if (patientLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box py={6} textAlign="center">
        <Alert severity="error">Patient not found.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/patients')}>
          Back to patients
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to="/dashboard" underline="hover">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/patients" underline="hover">
          Patients
        </Link>
        <Typography color="text.primary">{patient.displayId}</Typography>
      </Breadcrumbs>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(42,127,98,0.12)',
          background: 'rgba(255, 255, 255, 0.8)',
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {patient.displayId}
        </Typography>
        {patient.notes && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {patient.notes}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Created {format(patient.createdAt, 'PPpp')} • Updated {format(patient.updatedAt, 'PPpp')}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(42,127,98,0.12)',
          background: 'rgba(255, 255, 255, 0.8)',
          p: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Session history
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track every calculator run for this patient. Select sessions to export or copy results
              directly.
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<FileCopyRoundedIcon />}
              disabled={selectedSessionIds.length !== 1}
              onClick={() => {
                const session = sessions.find((item) => item.id === selectedSessionIds[0]);
                if (session) handleCopy(session);
              }}
            >
              Copy selected
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              disabled={selectedSessionIds.length === 0 || exportMutation.isPending}
              onClick={() => handleDownload('text')}
            >
              Download text
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadRoundedIcon />}
              disabled={selectedSessionIds.length === 0 || exportMutation.isPending}
              onClick={() => handleDownload('csv')}
            >
              Download CSV
            </Button>
          </Box>
        </Box>

        {exportError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {exportError}
          </Alert>
        )}
        {exportSuccess && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setExportSuccess(null)}>
            {exportSuccess}
          </Alert>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Selected</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessionsLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
              {!sessionsLoading && sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No sessions recorded yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {sessions.map((session) => {
                const result = results.find((item) => item.sessionId === session.id);
                const isSelected = selectedSessionIds.includes(session.id);
                return (
                  <TableRow key={session.id} hover>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSession(session.id)}
                        aria-label={`Select session ${session.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {session.templateName ?? session.templateId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.templateSlug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={session.status === 'submitted' ? 'success' : 'default'}
                        label={session.status}
                      />
                    </TableCell>
                    <TableCell>
                      {typeof session.score === 'number'
                        ? session.score.toFixed(2)
                        : (session.scoreText ?? '—')}
                    </TableCell>
                    <TableCell>{format(session.updatedAt, 'PPpp')}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Copy summary">
                        <span>
                          <IconButton
                            onClick={() => handleCopy(session)}
                            disabled={!result}
                            size="small"
                            aria-label={`Copy summary for session ${session.id}`}
                          >
                            <FileCopyRoundedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Open in calculators">
                        <IconButton
                          onClick={() =>
                            navigate(`/calculators/${session.templateSlug ?? session.templateId}`)
                          }
                          size="small"
                          aria-label={`Open session ${session.id} in calculator`}
                        >
                          <OpenInNewRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {latestResult && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(42,127,98,0.12)',
            background: 'rgba(255, 255, 255, 0.8)',
            p: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Latest result snapshot
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {latestResult.templateName ?? latestResult.templateId} •{' '}
                {format(latestResult.createdAt, 'PPpp')}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<FileCopyRoundedIcon />}
              onClick={() => handleCopy(latestSessions[0])}
            >
              Copy summary
            </Button>
          </Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Score{' '}
            {typeof latestResult.score === 'number'
              ? latestResult.score.toFixed(2)
              : (latestResult.scoreText ?? '—')}{' '}
            ({latestResult.interpretationLabel ?? 'Result'})
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {latestResult.interpretationSummary}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" color="text.secondary">
            Copy blocks
          </Typography>
          {(latestResult.copyBlocks ?? []).map((block, index) => (
            <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
              {block}
            </Typography>
          ))}
          {latestResult.copyBlocks?.length === 0 && latestResult.details && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
              {JSON.stringify(latestResult.details, null, 2)}
            </Typography>
          )}
        </Paper>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(42,127,98,0.12)',
          background: 'rgba(255, 255, 255, 0.8)',
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          View aggregate trends in the analytics workspace.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<InsertChartOutlinedRoundedIcon />}
          onClick={() => navigate('/analytics')}
        >
          Open analytics
        </Button>
      </Paper>
    </Box>
  );
};

export default PatientDetailPage;
