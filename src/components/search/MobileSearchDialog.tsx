import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { GlobalSearch } from './GlobalSearch';

interface MobileSearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSearchDialog: React.FC<MobileSearchDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: 'background.default' } }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
            Search Tools
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <GlobalSearch
          autoFocus
          sx={{ width: '100%', '& .MuiInputBase-root': { height: 48 } }}
          onSelect={onClose}
        />
        <Box display="flex" alignItems="center" gap={1} sx={{ color: 'text.secondary' }}>
          <SearchIcon fontSize="small" />
          <Typography variant="body2">
            Start typing to find calculators by name, condition, or keyword.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MobileSearchDialog;
