import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const ResetSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ResetForm = z.infer<typeof ResetSchema>;

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetForm) => {
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(data.email);
      setSuccess('Password reset email sent. Check your inbox for further instructions.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 420 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter the email associated with your SkinScores account and we’ll send a reset link.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Send reset email
          </LoadingButton>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Link component={RouterLink} to="/auth/sign-in">
            Back to sign in
          </Link>
          <Link component={RouterLink} to="/auth/register">
            Need an account?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
