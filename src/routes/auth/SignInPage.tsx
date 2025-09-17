import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInForm = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInForm) => {
    setError(null);
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 420 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sign in to access your SkinScores workspace.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Sign in
          </LoadingButton>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Link component={RouterLink} to="/auth/register">
            Create account
          </Link>
          <Link component={RouterLink} to="/auth/reset">
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignInPage;
