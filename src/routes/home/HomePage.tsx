import { ArrowForward, Calculate, Analytics, Security } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HeroShader } from '../../components/effects/HeroShader';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={heroSectionStyles}>
        <HeroShader />
        <Typography variant="overline" color="primary" fontWeight={600} gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
          Professional Dermatology Tools
        </Typography>
        <Typography variant="h1" fontWeight={700} gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
          Clinical Scoring
          <br />
          Made Simple
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mb: 4, position: 'relative', zIndex: 1 }}>
          Access 90+ validated dermatology assessment tools. Calculate scores, track patient progress, and generate clinical documentation.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/library')}
            sx={{ px: 4 }}
          >
            Browse All Tools
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/auth/sign-in')}
            sx={{ px: 4 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 8 }}>
        {featureHighlights.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 12px 24px rgba(107, 76, 138, 0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Trusted by Clinicians
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Join thousands of dermatologists who use SkinScores for accurate, efficient clinical assessments.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/library')}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

const heroSectionStyles = {
  textAlign: 'center',
  py: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 3,
  mb: 4,
} as const;

const featureHighlights = [
  {
    title: 'Evidence-Based Tools',
    description:
      'Every calculator is based on published research with full references and clinical validation data.',
    icon: <Calculate />,
  },
  {
    title: 'Track Patient Progress',
    description:
      'Save calculations to patient records, monitor trends over time, and export data for research.',
    icon: <Analytics />,
  },
  {
    title: 'HIPAA Compliant',
    description:
      'Secure cloud storage with enterprise-grade encryption ensures patient data remains protected.',
    icon: <Security />,
  },
];

export default HomePage;