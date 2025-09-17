import { Card, CardContent, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CardShader } from '../effects/CardShader';
import { useFavorites } from '../../hooks/useFavorites';

interface ToolCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  condition?: string;
  keywords?: string[];
  complexity?: 'basic' | 'intermediate' | 'advanced';
  estimatedTime?: number; // minutes
}

// Category colors mapping
const categoryColors: Record<string, string> = {
  'Psoriasis': '#8B6CAA',
  'Eczema': '#D4826A',
  'Acne': '#5A8A5A',
  'Skin Cancer': '#CC4444',
  'Autoimmune': '#4A90E2',
  'Other': '#666666',
};

const complexityConfig = {
  basic: { label: 'Basic', color: '#5A8A5A' },
  intermediate: { label: 'Intermediate', color: '#CC8800' },
  advanced: { label: 'Advanced', color: '#CC4444' },
};

export const ToolCard = ({
  id,
  name,
  slug,
  description,
  condition,
  keywords,
  complexity = 'basic',
  estimatedTime = 5,
}: ToolCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const categoryColor = condition ? categoryColors[condition] || categoryColors['Other'] : categoryColors['Other'];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${categoryColor}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(107, 76, 138, 0.15)',
        },
      }}
      onClick={() => navigate(`/calculators/${slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardShader visible={isHovered} />

      {/* Header with badges */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 2,
          zIndex: 2,
        }}
      >
        {/* Category icon */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: `${categoryColor}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 18, color: categoryColor }} />
        </Box>

        {/* Badges */}
        <Box display="flex" gap={0.5}>
          {/* Complexity badge */}
          <Chip
            label={complexityConfig[complexity].label}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 600,
              bgcolor: `${complexityConfig[complexity].color}22`,
              color: complexityConfig[complexity].color,
              border: `1px solid ${complexityConfig[complexity].color}44`,
            }}
          />

          {/* Time estimate */}
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
            label={`~${estimatedTime}min`}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '& .MuiChip-icon': { ml: 0.5, mr: -0.5 },
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'relative',
          zIndex: 1,
          pt: 7, // Make room for header badges
        }}
      >
        <Box>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Typography variant="h6" component="h3" fontWeight={600}>
              {name}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(id);
              }}
              sx={{
                color: isFavorite(id) ? 'warning.main' : 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.08)' },
              }}
              aria-label={isFavorite(id) ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
            >
              {isFavorite(id) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
          </Box>

          {condition && (
            <Typography variant="body2" color={categoryColor} fontWeight={500} gutterBottom>
              {condition}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {keywords && keywords.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {keywords.slice(0, 3).map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: 'divider',
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            ))}
            {keywords.length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                +{keywords.length - 3} more
              </Typography>
            )}
          </Box>
        )}

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/calculators/${slug}`);
          }}
          sx={{
            mt: 'auto',
            borderColor: categoryColor,
            color: categoryColor,
            '&:hover': {
              borderColor: categoryColor,
              backgroundColor: `${categoryColor}11`,
            },
          }}
        >
          Open Calculator
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
