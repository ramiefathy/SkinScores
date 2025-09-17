import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useState, useMemo, useEffect } from 'react';
import { BackgroundShader } from '../effects/BackgroundShader';
import { HeaderShader } from '../effects/HeaderShader';
import { GlobalSearch } from '../search/GlobalSearch';
import { QuickAccessBar } from '../navigation/QuickAccessBar';
import { Link as RouterLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToolsMetadata } from '../../hooks/useTools';
import NavigationDrawer from './NavigationDrawer';
import MobileSearchDialog from '../search/MobileSearchDialog';

const AppShell = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { data: tools = [] } = useToolsMetadata();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    tools.forEach((tool) => {
      const key = tool.condition ?? 'Other';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }))
      .slice(0, 10); // Show top 10 categories in dropdown
  }, [tools]);

  const handleCategoryNavigate = (category: string) => {
    setToolsMenuAnchor(null);
    navigate(`/library?category=${encodeURIComponent(category)}`);
  };

  const handleBrowseAllClick = () => {
    setToolsMenuAnchor(null);
    navigate('/library');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        const isEditable = target.isContentEditable || tagName === 'input' || tagName === 'textarea';
        if (isEditable && !(target as HTMLInputElement).dataset.globalSearchInput) {
          return;
        }
      }

      event.preventDefault();
      const prefersDesktop = window.matchMedia('(min-width:900px)').matches;

      if (prefersDesktop) {
        const input = document.querySelector<HTMLInputElement>('input[data-global-search-input]');
        if (input) {
          input.focus();
          input.select?.();
          return;
        }
      }

      setMobileSearchOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box display="flex" minHeight="100vh" flexDirection="column" sx={{ bgcolor: 'background.default' }}>
      <BackgroundShader />
      <AppBar position="sticky" sx={{ position: 'relative', overflow: 'hidden' }}>
        <HeaderShader />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Toolbar sx={{ px: 0 }}>
            <Box display="flex" alignItems="center" gap={3} flex={1}>
              <IconButton
                aria-label="Open navigation"
                edge="start"
                onClick={() => setMobileNavOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: -1 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                }}
              >
                SkinScores
              </Typography>
              <IconButton
                aria-label="Search tools"
                onClick={() => setMobileSearchOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              >
                <SearchIcon />
              </IconButton>
              <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={1.5}>
                <GlobalSearch />
                <QuickAccessBar />
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={(event) => setToolsMenuAnchor(event.currentTarget)}
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                >
                  Browse Tools
                </Button>
                {user && (
                  <>
                    <Button
                      component={RouterLink}
                      to="/dashboard"
                      startIcon={<DashboardIcon fontSize="small" />}
                      sx={navButtonStyles}
                    >
                      Dashboard
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/patients"
                      startIcon={<PeopleIcon fontSize="small" />}
                      sx={navButtonStyles}
                    >
                      Patients
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/analytics"
                      startIcon={<AnalyticsIcon fontSize="small" />}
                      sx={navButtonStyles}
                    >
                      Analytics
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {user ? (
                <>
                  <Avatar
                    onClick={(event) => setMenuAnchor(event.currentTarget)}
                    sx={{
                      cursor: 'pointer',
                      width: 36,
                      height: 36,
                      fontSize: '0.875rem',
                    }}
                    src={user.photoURL ?? undefined}
                  >
                    {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
                  </Avatar>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    PaperProps={{
                      sx: { mt: 1, minWidth: 200 }
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        setMenuAnchor(null);
                        navigate('/dashboard');
                      }}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={async () => {
                        setMenuAnchor(null);
                        await signOut();
                        navigate('/');
                      }}
                    >
                      Sign out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/auth/sign-in')}
                >
                  Sign in
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={toolsMenuAnchor}
        open={Boolean(toolsMenuAnchor)}
        onClose={() => setToolsMenuAnchor(null)}
        PaperProps={{
          sx: { mt: 1, minWidth: 280 }
        }}
      >
        <MenuItem onClick={handleBrowseAllClick}>
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Browse All Tools"
            secondary={`${tools.length} tools available`}
          />
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <Typography variant="overline" color="text.secondary">
            Browse by Category
          </Typography>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category.name}
            onClick={() => handleCategoryNavigate(category.name)}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <CategoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={category.name} />
            <Typography variant="body2" color="text.secondary">
              {category.count}
            </Typography>
          </MenuItem>
        ))}
        {tools.length > categories.reduce((sum, cat) => sum + cat.count, 0) && (
          <>
            <Divider />
            <MenuItem onClick={handleBrowseAllClick}>
              <Typography variant="body2" color="primary">
                View all categories →
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      <NavigationDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenSearch={() => {
          setMobileNavOpen(false);
          setMobileSearchOpen(true);
        }}
      />

      <Box component="main" flex={1} display="flex" flexDirection="column">
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Outlet />
        </Container>
      </Box>
      <MobileSearchDialog open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
    </Box>
  );
};

const navButtonStyles = {
  color: 'text.primary',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiButton-startIcon': {
    color: 'text.secondary',
  },
};

export default AppShell;
