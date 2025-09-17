import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const RegisterSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', displayName: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await registerUser(data.email, data.password, data.displayName);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 440 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Join SkinScores to streamline your clinical documentation.
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
            label="Full name"
            autoComplete="name"
            {...register('displayName')}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            fullWidth
          />
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
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <TextField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Create account
          </LoadingButton>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Link component={RouterLink} to="/auth/sign-in">
            Have an account? Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
