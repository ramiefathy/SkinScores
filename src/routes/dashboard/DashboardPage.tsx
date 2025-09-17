import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useScoreSessions } from '../../hooks/useScoreSessions';
import { useToolsMetadata } from '../../hooks/useTools';

const DashboardPage = () => {
  const { data: sessions = [], isLoading: sessionsLoading } = useScoreSessions();
  const { data: tools = [] } = useToolsMetadata();

  const recentSessions = useMemo(() => sessions.slice(0, 5), [sessions]);
  const templateLookup = useMemo(() => {
    const map: Record<string, string> = {};
    tools.forEach((tool) => {
      map[tool.slug] = tool.name;
      map[tool.id] = tool.name;
      map[tool.loaderId] = tool.name;
    });
    return map;
  }, [tools]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Track your recent scoring activity and stay aligned with clinical goals.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={paperStyles}>
            <Typography variant="h6" gutterBottom>
              Recent Score Sessions
            </Typography>
            {sessionsLoading && (
              <Typography variant="body2" color="text.secondary">
                Loading sessions...
              </Typography>
            )}
            {!sessionsLoading && recentSessions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No sessions yet. Once you run a calculator, you will see a summary here.
              </Typography>
            )}
            {!sessionsLoading && recentSessions.length > 0 && (
              <List disablePadding>
                {recentSessions.map((session) => (
                  <ListItem key={session.id} disableGutters sx={{ py: 1.5 }}>
                    <ListItemText
                      primaryTypographyProps={{ fontWeight: 600 }}
                      primary={
                        templateLookup[session.templateSlug ?? session.templateId] ??
                        session.templateName ??
                        'Unknown template'
                      }
                      secondary={`${format(session.updatedAt, 'PPpp')}${
                        session.interpretationLabel ? ` • ${session.interpretationLabel}` : ''
                      }`}
                    />
                    {(typeof session.score === 'number' || session.scoreText) && (
                      <Typography variant="body2" fontWeight={600} sx={{ mr: 2 }}>
                        {typeof session.score === 'number'
                          ? session.score.toFixed(2)
                          : session.scoreText}
                      </Typography>
                    )}
                    <Chip
                      color={session.status === 'submitted' ? 'success' : 'default'}
                      label={session.status === 'submitted' ? 'Submitted' : 'Draft'}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={paperStyles}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a calculator from the library to start a new session.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const paperStyles = {
  p: 3,
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 3,
  border: '1px solid rgba(42, 127, 98, 0.08)',
};

export default DashboardPage;
