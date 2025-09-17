import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10}>
      <Typography variant="h2" fontWeight={700} gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        We couldn’t find the page you were looking for.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Back home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
