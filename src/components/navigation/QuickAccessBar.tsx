import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Chip,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useFavorites } from '../../hooks/useFavorites';
import { useToolsMetadata } from '../../hooks/useTools';

export const QuickAccessBar: React.FC = () => {
  const navigate = useNavigate();
  const { recentTools } = useRecentTools();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { data: allTools = [] } = useToolsMetadata();

  // Get tool data for favorites
  const favoriteTools = favorites
    .map(id => allTools.find(tool => tool.id === id))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
    .slice(0, 3); // Limit to 3 favorites in header

  const handleToolClick = (slug: string) => {
    navigate(`/calculators/${slug}`);
  };

  if (recentTools.length === 0 && favoriteTools.length === 0) {
    return null;
  }

  return (
    <Box
      display={{ xs: 'none', lg: 'flex' }}
      alignItems="center"
      gap={1}
      ml={2}
    >
      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Recent:
            </Typography>
            {recentTools.slice(0, 3).map((recent) => (
              <Tooltip key={recent.toolId} title={`Last used: ${new Date(recent.lastUsed).toLocaleDateString()}`}>
                <Chip
                  label={recent.toolName}
                  size="small"
                  variant="outlined"
                  onClick={() => handleToolClick(recent.toolSlug)}
                  sx={{
                    cursor: 'pointer',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {favoriteTools.length > 0 && (
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          )}
        </>
      )}

      {/* Favorite Tools */}
      {favoriteTools.length > 0 && (
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            Favorites:
          </Typography>
          {favoriteTools.map((tool) => (
            <Box key={tool.id} display="flex" alignItems="center">
              <Chip
                label={tool.name}
                size="small"
                variant="filled"
                color="primary"
                onClick={() => handleToolClick(tool.slug)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
                sx={{ ml: -0.5 }}
                aria-label={`Remove ${tool.name} from favorites`}
              >
                <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
