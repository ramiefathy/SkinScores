import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Breadcrumbs,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Container,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Control, FieldErrors, FieldError } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { callSubmitToolResult } from '../../firebase/functions';
import { useAuth } from '../../hooks/useAuth';
import { sessionsQueryKey } from '../../hooks/useScoreSessions';
import { useTool } from '../../hooks/useTools';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useFavorites } from '../../hooks/useFavorites';
import type {
  FormSectionConfig,
  InputConfig,
  InputGroupConfig,
  Tool,
  CalculationResult,
  InputValue,
} from '../../tools/types';

const flattenInputs = (sections: FormSectionConfig[]): InputConfig[] => {
  const result: InputConfig[] = [];
  sections.forEach((section) => {
    if (isInputGroup(section)) {
      section.inputs.forEach((input) => result.push(input));
    } else {
      result.push(section);
    }
  });
  return result;
};

const isInputGroup = (section: FormSectionConfig): section is InputGroupConfig =>
  (section as InputGroupConfig).inputs !== undefined;

const isInputFilled = (value: unknown, input: InputConfig): boolean => {
  switch (input.type) {
    case 'checkbox':
      return Boolean(value);
    case 'number':
    case 'select':
    case 'radio':
      return value !== undefined && value !== null && value !== '';
    case 'text':
    case 'textarea':
      return typeof value === 'string'
        ? value.trim().length > 0
        : value !== undefined && value !== null;
    default:
      return value !== undefined && value !== null && value !== '';
  }
};

const buildFormSchema = (tool?: Tool) => {
  if (!tool) return null;
  const shape: Record<string, z.ZodTypeAny> = {};
  flattenInputs(tool.formSections).forEach((input) => {
    if (input.validation) {
      shape[input.id] = input.validation;
    } else {
      shape[input.id] = z.any().optional();
    }
  });
  const keys = Object.keys(shape);
  if (keys.length === 0) return null;
  return z.object(shape);
};

const buildDefaultValues = (tool?: Tool) => {
  if (!tool) return {} as Record<string, unknown>;
  const defaults: Record<string, unknown> = {};
  flattenInputs(tool.formSections).forEach((input) => {
    if (input.defaultValue !== undefined) {
      defaults[input.id] = input.defaultValue;
      return;
    }
    switch (input.type) {
      case 'checkbox':
        defaults[input.id] = false;
        break;
      case 'number':
        defaults[input.id] = '';
        break;
      case 'select':
      case 'radio':
        defaults[input.id] = input.options?.[0]?.value ?? '';
        break;
      default:
        defaults[input.id] = '';
    }
  });
  return defaults;
};

const formatDetailEntries = (details?: Record<string, unknown>) =>
  details
    ? Object.entries(details).map(([key, value]) => `${key}: ${formatDetailValue(value)}`)
    : [];

const formatDetailValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  }
  return String(value);
};

const CalculatorRunnerPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addRecentTool } = useRecentTools();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { data, isLoading } = useTool(slug);
  const tool = data?.tool;
  const metadata = data?.metadata;

  const formSchema = useMemo(() => buildFormSchema(tool), [tool]);
  const defaultValues = useMemo(() => buildDefaultValues(tool), [tool]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    defaultValues,
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (tool && metadata) {
      reset(buildDefaultValues(tool));
      // Track tool usage
      addRecentTool(tool.id, metadata.slug, tool.name);
    }
  }, [tool, metadata, reset, addRecentTool]);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CalculationResult | null>(null);

  const watchedValues = watch();

  const progressSummary = useMemo(() => {
    if (!tool) {
      return {
        totalFields: 0,
        completedFields: 0,
        sections: [] as Array<{ id: string; label: string; total: number; completed: number }>,
      };
    }

    const sections = tool.formSections.map((section, index) => {
      const inputs = isInputGroup(section) ? section.inputs : [section];
      const completed = inputs.reduce((count, input) => {
        const value = (watchedValues as Record<string, unknown>)[input.id];
        return count + (isInputFilled(value, input) ? 1 : 0);
      }, 0);

      const label = isInputGroup(section) ? section.title || `Section ${index + 1}` : section.label;

      return {
        id: section.id,
        label,
        total: inputs.length,
        completed,
      };
    });

    const aggregate = sections.reduce(
      (acc, section) => {
        acc.total += section.total;
        acc.completed += section.completed;
        return acc;
      },
      { total: 0, completed: 0 },
    );

    return {
      totalFields: aggregate.total,
      completedFields: aggregate.completed,
      sections,
    };
  }, [tool, watchedValues]);

  const overallProgress = progressSummary.totalFields
    ? Math.round((progressSummary.completedFields / progressSummary.totalFields) * 100)
    : 0;

  const mutation = useMutation({
    mutationFn: async (payload: { values: Record<string, unknown>; result: CalculationResult }) => {
      if (!tool || !metadata) throw new Error('Tool not loaded');
      await callSubmitToolResult({
        toolId: tool.id,
        toolSlug: metadata.slug,
        toolName: tool.name,
        inputs: payload.values,
        result: payload.result,
      });
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({ queryKey: sessionsQueryKey(user.uid) });
      }
      setSuccessMessage('Result saved successfully.');
      setSubmitError(null);
      if (tool) {
        reset(buildDefaultValues(tool));
      }
    },
    onError: (error: unknown) => {
      setSuccessMessage(null);
      setSubmitError((error as Error).message);
    },
  });

  const onSubmit = async (values: Record<string, unknown>) => {
    if (!tool) return;
    const calculation = tool.calculationLogic(values as Record<string, InputValue>);
    setLastResult(calculation);
    if (!user) {
      setSubmitError(null);
      setSuccessMessage('Result calculated. Sign in to save this session.');
      return;
    }
    await mutation.mutateAsync({ values, result: calculation });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center">
          <Typography variant="h6">Loading calculator...</Typography>
        </Box>
      </Container>
    );
  }

  if (!tool || !metadata) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center">
          <Alert severity="error" sx={{ mb: 2 }}>
            We couldn&apos;t find that calculator.
          </Alert>
          <Link component={RouterLink} to="/library">
            Back to library
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/library" underline="hover" color="inherit">
          Tools Library
        </Link>
        <Typography color="text.primary">{tool.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4" fontWeight={700}>
                  {tool.name}
                </Typography>
                <IconButton
                  onClick={() => toggleFavorite(tool.id)}
                  color={isFavorite(tool.id) ? 'warning' : 'default'}
                  title={isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={
                    isFavorite(tool.id)
                      ? `Remove ${tool.name} from favorites`
                      : `Add ${tool.name} to favorites`
                  }
                >
                  {isFavorite(tool.id) ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Box>
              {tool.acronym && (
                <Typography variant="h6" color="text.secondary" fontWeight={400} gutterBottom>
                  {tool.acronym}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary" paragraph>
                {tool.description}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tool.condition && <Chip label={tool.condition} color="primary" size="small" />}
                {tool.keywords?.slice(0, 3).map((keyword) => (
                  <Chip key={keyword} label={keyword} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Paper>

          {progressSummary.totalFields > 0 && (
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    Completion progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {progressSummary.completedFields} of {progressSummary.totalFields} fields
                    completed
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {overallProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{ height: 8, borderRadius: 4, mb: progressSummary.sections.length > 1 ? 2 : 0 }}
              />
              {progressSummary.sections.length > 1 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {progressSummary.sections.map((section) => (
                    <Chip
                      key={section.id}
                      label={`${section.label}: ${section.completed}/${section.total}`}
                      color={section.completed === section.total ? 'success' : 'default'}
                      variant={section.completed === section.total ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Paper>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Input Parameters
              </Typography>
              <Stack spacing={4}>
                {tool.formSections.map((section, index) => (
                  <FormSection
                    key={isInputGroup(section) ? section.id : `${section.id}-${index}`}
                    section={section}
                    control={control}
                    errors={errors}
                  />
                ))}
              </Stack>
            </Paper>

            <Stack spacing={2}>
              {submitError && <Alert severity="error">{submitError}</Alert>}
              {successMessage && (
                <Alert
                  severity={user ? 'success' : 'info'}
                  onClose={() => setSuccessMessage(null)}
                  icon={user ? <CheckCircleIcon /> : undefined}
                >
                  {successMessage}
                </Alert>
              )}

              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={mutation.isPending}
                startIcon={<CalculateIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Calculate Score
              </LoadingButton>

              {!user && (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Sign in to save your calculations to patient history
                </Typography>
              )}
            </Stack>
          </form>

          {lastResult && (
            <Paper elevation={0} sx={{ p: 4, mt: 4, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Result
              </Typography>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {typeof lastResult.score === 'number'
                  ? lastResult.score.toFixed(2)
                  : (lastResult.score ?? '—')}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                {lastResult.interpretation}
              </Typography>
              {lastResult.details && (
                <Box mt={3}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                  <Typography variant="overline" display="block" gutterBottom>
                    Calculation Details
                  </Typography>
                  <Stack spacing={0.5}>
                    {formatDetailEntries(lastResult.details).map((entry) => (
                      <Typography key={entry} variant="body2">
                        {entry}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
              <Typography variant="caption" display="block" sx={{ mt: 3, opacity: 0.8 }}>
                Calculated on {format(new Date(), 'PPpp')}
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              About this Tool
            </Typography>

            <Accordion
              defaultExpanded
              elevation={0}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>Clinical Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {tool.sourceType && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Source Type
                      </Typography>
                      <Typography variant="body2">{tool.sourceType}</Typography>
                    </Box>
                  )}
                  {tool.rationale && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Rationale
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {tool.rationale}
                      </Typography>
                    </Box>
                  )}
                  {tool.clinicalPerformance && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Clinical Performance
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {tool.clinicalPerformance}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {tool.references && tool.references.length > 0 && (
              <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>References ({tool.references.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack component="ol" spacing={2} sx={{ pl: 2, m: 0 }}>
                    {tool.references.map((reference, index) => (
                      <Typography key={index} component="li" variant="body2">
                        {reference}
                      </Typography>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {successMessage && user && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate('/dashboard')}
              >
                View in Dashboard
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const FormSection = ({
  section,
  control,
  errors,
}: {
  section: FormSectionConfig;
  control: Control<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
}) => {
  if (isInputGroup(section)) {
    const columns = section.gridCols ?? 1;
    const md = Math.max(12 / columns, 3);
    return (
      <Box>
        {section.title && (
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {section.title}
          </Typography>
        )}
        {section.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {section.description}
          </Typography>
        )}
        <Grid container spacing={2}>
          {section.inputs.map((input) => (
            <Grid item xs={12} md={Math.min(12, Math.max(3, Math.floor(md)))} key={input.id}>
              <FormInput control={control} input={input} error={errors[input.id]} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return <FormInput control={control} input={section} error={errors[section.id]} />;
};

const FormInput = ({
  control,
  input,
  error,
}: {
  control: Control<Record<string, unknown>>;
  input: InputConfig;
  error: FieldErrors<Record<string, unknown>>[string];
}) => {
  const helperText = (error as FieldError | undefined)?.message ?? input.description;

  switch (input.type) {
    case 'number':
      return (
        <Controller
          name={input.id}
          control={control}
          defaultValue={input.defaultValue ?? ''}
          render={({ field }) => (
            <TextField
              type="number"
              label={input.label}
              fullWidth
              value={field.value ?? ''}
              onBlur={field.onBlur}
              onChange={(event) => {
                const raw = event.target.value;
                field.onChange(raw === '' ? '' : Number(raw));
              }}
              error={Boolean(error)}
              helperText={helperText}
              inputProps={{ min: input.min, max: input.max, step: input.step ?? 'any' }}
            />
          )}
        />
      );
    case 'select':
      return (
        <Controller
          name={input.id}
          control={control}
          defaultValue={input.defaultValue ?? input.options?.[0]?.value ?? ''}
          render={({ field }) => {
            const isNumeric = input.options?.every((option) => typeof option.value === 'number');
            return (
              <TextField
                select
                label={input.label}
                fullWidth
                value={field.value ?? ''}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(isNumeric ? Number(value) : value);
                }}
                error={Boolean(error)}
                helperText={helperText}
              >
                {input.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />
      );
    case 'checkbox':
      return (
        <Controller
          name={input.id}
          control={control}
          defaultValue={Boolean(input.defaultValue)}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                />
              }
              label={input.label}
            />
          )}
        />
      );
    case 'radio':
      return (
        <Controller
          name={input.id}
          control={control}
          defaultValue={input.defaultValue ?? input.options?.[0]?.value ?? ''}
          render={({ field }) => (
            <FormControl error={Boolean(error)}>
              <FormLabel>{input.label}</FormLabel>
              <RadioGroup
                value={field.value ?? ''}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
              >
                {input.options?.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {helperText && (
                <Typography variant="caption" color={error ? 'error' : 'text.secondary'}>
                  {helperText}
                </Typography>
              )}
            </FormControl>
          )}
        />
      );
    default:
      return (
        <Controller
          name={input.id}
          control={control}
          defaultValue={input.defaultValue ?? ''}
          render={({ field }) => (
            <TextField
              label={input.label}
              fullWidth
              multiline={false}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              onChange={field.onChange}
              error={Boolean(error)}
              helperText={helperText}
            />
          )}
        />
      );
  }
};

export default CalculatorRunnerPage;
