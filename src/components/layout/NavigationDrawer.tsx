import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToolsMetadata } from '../../hooks/useTools';

type NavigationDrawerProps = {
  open: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
};

const NavigationDrawer = ({ open, onClose, onOpenSearch }: NavigationDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: tools = [] } = useToolsMetadata();

  const items = useMemo(
    () => [
      { label: 'Home', icon: <HomeRoundedIcon />, path: '/' },
      { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard' },
      { label: 'Calculators', icon: <AssessmentRoundedIcon />, path: '/library' },
      { label: 'Patients', icon: <AssessmentRoundedIcon />, path: '/patients' },
      { label: 'Analytics', icon: <AssessmentRoundedIcon />, path: '/analytics' },
    ],
    [],
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    tools.forEach((tool) => {
      const key = tool.condition ?? 'Other';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [tools]);

  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={{ display: { md: 'none' } }}>
      <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List>
          {onOpenSearch && (
            <ListItemButton
              onClick={() => {
                onOpenSearch();
              }}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search Tools" />
            </ListItemButton>
          )}
          {onOpenSearch && <Divider sx={{ my: 1 }} />}
          {items.map(({ label, icon, path }) => (
            <ListItemButton
              key={path}
              selected={location.pathname === path}
              onClick={() => handleNavigate(path)}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box px={2} pb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Categories
          </Typography>
          <List disablePadding>
            {categories.map(([category, count]) => (
              <ListItemButton
                key={category}
                onClick={() => {
                  navigate(`/library?category=${encodeURIComponent(category)}`);
                  onClose();
                }}
              >
                <ListItemText primary={category} secondary={`${count} tools`} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box px={2} pb={2} mt="auto">
          {user ? (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {user.displayName ?? user.email}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={async () => {
                  await signOut();
                  onClose();
                  navigate('/');
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                onClose();
                navigate('/auth/sign-in');
              }}
            >
              Sign in
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NavigationDrawer;
