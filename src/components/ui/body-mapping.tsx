"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ZoomIn, 
  ZoomOut, 
  Camera, 
  Palette, 
  Info, 
  RotateCw,
  Maximize2, 
  Grid3X3
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

interface BodyRegion {
  id: string;
  name: string;
  percentage: number;
  severity?: number;
  subRegions?: string[];
}

interface BodyMappingProps {
  regions: BodyRegion[];
  onRegionUpdate: (regionId: string, data: Partial<BodyRegion>) => void;
  mode?: 'percentage' | 'severity' | 'both';
  showHeatmap?: boolean;
  allowPhotoAnnotation?: boolean;
  className?: string;
}

// Define anatomical regions with their SVG paths
const BODY_REGIONS = {
  front: {
    head_neck: {
      face: "M 250 40 C 215 40, 185 55, 185 85 C 185 95, 186 105, 188 115 L 190 125 C 192 135, 197 143, 207 148 L 215 150 L 285 150 L 293 148 C 303 143, 308 135, 310 125 L 312 115 C 314 105, 315 95, 315 85 C 315 55, 285 40, 250 40 Z",
      scalp: "M 250 20 C 220 20, 190 30, 185 40 L 185 50 C 185 55, 215 40, 250 40 C 285 40, 315 55, 315 50 L 315 40 C 310 30, 280 20, 250 20 Z",
      neck: "M 215 150 L 215 175 C 215 185, 220 190, 230 193 L 250 195 L 270 193 C 280 190, 285 185, 285 175 L 285 150 Z"
    },
    trunk: {
      chest: "M 230 195 C 210 195, 185 200, 165 210 C 155 215, 150 220, 145 230 L 140 245 L 138 270 L 138 310 L 140 340 L 145 360 L 150 375 C 165 380, 185 382, 250 382 C 315 382, 335 380, 350 375 L 355 360 L 360 340 L 362 310 L 362 270 L 360 245 L 355 230 C 350 220, 345 215, 335 210 C 315 200, 290 195, 270 195 Z",
      abdomen: "M 150 375 L 148 400 L 148 440 L 150 480 L 155 510 L 160 530 C 170 535, 195 538, 250 538 C 305 538, 330 535, 340 530 L 345 510 L 350 480 L 352 440 L 352 400 L 350 375 Z",
      genitals: "M 160 530 L 165 545 C 175 550, 210 552, 250 552 C 290 552, 325 550, 335 545 L 340 530 Z"
    },
    upper_limbs: {
      left_shoulder: "M 165 210 C 155 210, 145 213, 135 220 L 125 230 L 120 245 L 118 260 L 120 275 L 125 285 L 135 290 L 145 287 L 155 280 L 165 270 Z",
      left_arm: "M 125 285 L 120 305 L 115 335 L 112 365 L 110 395 L 109 425 L 110 455 L 112 480 C 114 490, 118 495, 122 495 C 126 495, 130 490, 132 480 L 134 455 L 136 425 L 138 395 L 141 365 L 144 335 L 147 305 L 150 285 Z",
      left_hand: "M 112 480 L 110 500 L 108 515 C 108 520, 110 523, 113 523 L 118 523 L 123 523 C 126 523, 128 520, 128 515 L 126 500 L 124 480 Z",
      right_shoulder: "M 335 210 C 345 210, 355 213, 365 220 L 375 230 L 380 245 L 382 260 L 380 275 L 375 285 L 365 290 L 355 287 L 345 280 L 335 270 Z",
      right_arm: "M 375 285 L 380 305 L 385 335 L 388 365 L 390 395 L 391 425 L 390 455 L 388 480 C 386 490, 382 495, 378 495 C 374 495, 370 490, 368 480 L 366 455 L 364 425 L 362 395 L 359 365 L 356 335 L 353 305 L 350 285 Z",
      right_hand: "M 388 480 L 390 500 L 392 515 C 392 520, 390 523, 387 523 L 382 523 L 377 523 C 374 523, 372 520, 372 515 L 374 500 L 376 480 Z"
    },
    lower_limbs: {
      left_thigh: "M 165 545 L 160 565 L 155 595 L 152 625 L 150 655 L 148 685 L 147 715 L 148 740 L 150 760 C 155 765, 165 767, 175 767 C 185 767, 195 765, 200 760 L 202 740 L 203 715 L 204 685 L 206 655 L 209 625 L 212 595 L 217 565 L 222 545 Z",
      left_leg: "M 150 760 L 148 785 L 146 815 L 145 845 L 144 870 C 144 875, 148 878, 153 878 C 158 878, 162 875, 162 870 L 163 845 L 165 815 L 167 785 L 170 760 L 200 760 L 197 785 L 195 815 L 194 845 L 193 870 C 193 875, 197 878, 202 878 C 207 878, 211 875, 211 870 L 212 845 L 214 815 L 216 785 L 219 760 Z",
      left_foot: "M 144 870 L 143 885 C 143 890, 147 893, 152 893 L 160 893 C 165 893, 169 890, 169 885 L 168 870 Z M 193 870 L 192 885 C 192 890, 196 893, 201 893 L 209 893 C 214 893, 218 890, 218 885 L 217 870 Z",
      right_thigh: "M 335 545 L 340 565 L 345 595 L 348 625 L 350 655 L 352 685 L 353 715 L 352 740 L 350 760 C 345 765, 335 767, 325 767 C 315 767, 305 765, 300 760 L 298 740 L 297 715 L 296 685 L 294 655 L 291 625 L 288 595 L 283 565 L 278 545 Z",
      right_leg: "M 350 760 L 352 785 L 354 815 L 355 845 L 356 870 C 356 875, 352 878, 347 878 C 342 878, 338 875, 338 870 L 337 845 L 335 815 L 333 785 L 330 760 L 300 760 L 303 785 L 305 815 L 306 845 L 307 870 C 307 875, 303 878, 298 878 C 293 878, 289 875, 289 870 L 288 845 L 286 815 L 284 785 L 281 760 Z",
      right_foot: "M 356 870 L 357 885 C 357 890, 353 893, 348 893 L 340 893 C 335 893, 331 890, 331 885 L 332 870 Z M 307 870 L 308 885 C 308 890, 304 893, 299 893 L 291 893 C 286 893, 282 890, 282 885 L 283 870 Z"
    }
  },
  back: {
    head_neck: {
      head_back: "M 250 40 C 215 40, 185 55, 185 85 C 185 95, 186 105, 188 115 L 190 125 C 192 135, 197 143, 207 148 L 215 150 L 285 150 L 293 148 C 303 143, 308 135, 310 125 L 312 115 C 314 105, 315 95, 315 85 C 315 55, 285 40, 250 40 Z",
      neck_back: "M 215 150 L 215 175 C 215 185, 220 190, 230 193 L 250 195 L 270 193 C 280 190, 285 185, 285 175 L 285 150 Z"
    },
    trunk: {
      upper_back: "M 230 195 C 210 195, 185 200, 165 210 C 155 215, 150 220, 145 230 L 140 245 L 138 270 L 138 310 L 140 340 L 145 360 L 150 375 C 165 380, 185 382, 250 382 C 315 382, 335 380, 350 375 L 355 360 L 360 340 L 362 310 L 362 270 L 360 245 L 355 230 C 350 220, 345 215, 335 210 C 315 200, 290 195, 270 195 Z",
      lower_back: "M 150 375 L 148 400 L 148 440 L 150 480 L 155 510 L 160 530 C 170 535, 195 538, 250 538 C 305 538, 330 535, 340 530 L 345 510 L 350 480 L 352 440 L 352 400 L 350 375 Z",
      buttocks: "M 160 530 L 165 555 L 170 570 C 180 575, 210 577, 250 577 C 290 577, 320 575, 330 570 L 335 555 L 340 530 Z"
    },
    upper_limbs: {
      // Same as front view for simplicity
      left_shoulder: "M 165 210 C 155 210, 145 213, 135 220 L 125 230 L 120 245 L 118 260 L 120 275 L 125 285 L 135 290 L 145 287 L 155 280 L 165 270 Z",
      left_arm: "M 125 285 L 120 305 L 115 335 L 112 365 L 110 395 L 109 425 L 110 455 L 112 480 C 114 490, 118 495, 122 495 C 126 495, 130 490, 132 480 L 134 455 L 136 425 L 138 395 L 141 365 L 144 335 L 147 305 L 150 285 Z",
      left_hand: "M 112 480 L 110 500 L 108 515 C 108 520, 110 523, 113 523 L 118 523 L 123 523 C 126 523, 128 520, 128 515 L 126 500 L 124 480 Z",
      right_shoulder: "M 335 210 C 345 210, 355 213, 365 220 L 375 230 L 380 245 L 382 260 L 380 275 L 375 285 L 365 290 L 355 287 L 345 280 L 335 270 Z",
      right_arm: "M 375 285 L 380 305 L 385 335 L 388 365 L 390 395 L 391 425 L 390 455 L 388 480 C 386 490, 382 495, 378 495 C 374 495, 370 490, 368 480 L 366 455 L 364 425 L 362 395 L 359 365 L 356 335 L 353 305 L 350 285 Z",
      right_hand: "M 388 480 L 390 500 L 392 515 C 392 520, 390 523, 387 523 L 382 523 L 377 523 C 374 523, 372 520, 372 515 L 374 500 L 376 480 Z"
    },
    lower_limbs: {
      // Same as front view for simplicity
      left_thigh: "M 165 570 L 160 590 L 155 620 L 152 650 L 150 680 L 148 710 L 147 740 L 148 765 L 150 785 C 155 790, 165 792, 175 792 C 185 792, 195 790, 200 785 L 202 765 L 203 740 L 204 710 L 206 680 L 209 650 L 212 620 L 217 590 L 222 570 Z",
      left_leg: "M 150 785 L 148 810 L 146 840 L 145 865 L 144 885 C 144 890, 148 893, 153 893 C 158 893, 162 890, 162 885 L 163 865 L 165 840 L 167 810 L 170 785 L 200 785 L 197 810 L 195 840 L 194 865 L 193 885 C 193 890, 197 893, 202 893 C 207 893, 211 890, 211 885 L 212 865 L 214 840 L 216 810 L 219 785 Z",
      left_foot: "M 144 885 L 143 895 C 143 900, 147 903, 152 903 L 160 903 C 165 903, 169 900, 169 895 L 168 885 Z M 193 885 L 192 895 C 192 900, 196 903, 201 903 L 209 903 C 214 903, 218 900, 218 895 L 217 885 Z",
      right_thigh: "M 335 570 L 340 590 L 345 620 L 348 650 L 350 680 L 352 710 L 353 740 L 352 765 L 350 785 C 345 790, 335 792, 325 792 C 315 792, 305 790, 300 785 L 298 765 L 297 740 L 296 710 L 294 680 L 291 650 L 288 620 L 283 590 L 278 570 Z",
      right_leg: "M 350 785 L 352 810 L 354 840 L 355 865 L 356 885 C 356 890, 352 893, 347 893 C 342 893, 338 890, 338 885 L 337 865 L 335 840 L 333 810 L 330 785 L 300 785 L 303 810 L 305 840 L 306 865 L 307 885 C 307 890, 303 893, 298 893 C 293 893, 289 890, 289 885 L 288 865 L 286 840 L 284 810 L 281 785 Z",
      right_foot: "M 356 885 L 357 895 C 357 900, 353 903, 348 903 L 340 903 C 335 900, 331 900, 331 895 L 332 885 Z M 307 885 L 308 895 C 308 900, 304 903, 299 903 L 291 903 C 286 903, 282 900, 282 895 L 283 885 Z"
    }
  }
};

// Quick percentage buttons
const QUICK_PERCENTAGES = [0, 10, 25, 50, 75, 100];

export function BodyMapping({
  regions,
  onRegionUpdate,
  mode = 'both',
  showHeatmap = true,
  allowPhotoAnnotation = false,
  className
}: BodyMappingProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(1);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showPercentages, setShowPercentages] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  const handleRegionClick = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
  }, []);

  const getRegionData = useCallback((regionId: string) => {
    return regions.find(r => r.id === regionId);
  }, [regions]);

  const getRegionColor = useCallback((regionId: string) => {
    const region = getRegionData(regionId);
    if (!region) return 'fill-muted';
    
    if (!showHeatmap) return 'fill-muted hover:fill-primary/20';
    
    const value = mode === 'severity' ? (region.severity || 0) : region.percentage;
    const intensity = value / (mode === 'severity' ? 3 : 100);
    
    if (intensity === 0) return 'fill-slate-100';
    if (intensity < 0.25) return 'fill-green-200';
    if (intensity < 0.5) return 'fill-yellow-200';
    if (intensity < 0.75) return 'fill-orange-200';
    return 'fill-red-200';
  }, [getRegionData, mode, showHeatmap]);

  const renderBodyRegions = useCallback((view: 'front' | 'back') => {
    const bodyParts = BODY_REGIONS[view];
    const elements: JSX.Element[] = [];

    Object.entries(bodyParts).forEach(([mainRegion, subRegions]) => {
      const regionData = getRegionData(mainRegion);
      
      Object.entries(subRegions).forEach(([subRegionId, path]) => {
        elements.push(
          <motion.path
            key={`${mainRegion}-${subRegionId}`}
            d={path as string}
            fill={getRegionColor(mainRegion)}
            stroke="#e5e7eb"
            strokeWidth="2"
            className={cn(
              "cursor-pointer transition-all duration-200",
              hoveredRegion === `${mainRegion}-${subRegionId}` && "stroke-primary stroke-[3] brightness-110",
              selectedRegion === mainRegion && "stroke-primary stroke-[4] filter drop-shadow-lg"
            )}
            onMouseEnter={() => setHoveredRegion(`${mainRegion}-${subRegionId}`)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick(mainRegion)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          />
        );
      });

      // Add percentage labels
      if (showPercentages && regionData && regionData.percentage > 0) {
        const positions: Record<string, { x: number, y: number }> = {
          head_neck: { x: 250, y: 100 },
          trunk: { x: 250, y: 350 },
          upper_limbs: { x: view === 'front' ? 150 : 350, y: 350 },
          lower_limbs: { x: 250, y: 700 }
        };

        const pos = positions[mainRegion];
        if (pos) {
          elements.push(
            <motion.g key={`${mainRegion}-label`}>
              <motion.rect
                x={pos.x - 30}
                y={pos.y - 15}
                width="60"
                height="30"
                rx="15"
                fill="white"
                stroke={selectedRegion === mainRegion ? "#3b82f6" : "#e5e7eb"}
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="text-sm font-semibold fill-slate-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {regionData.percentage}%
              </motion.text>
            </motion.g>
          );
        }
      }
    });

    return elements;
  }, [getRegionData, getRegionColor, hoveredRegion, selectedRegion, showPercentages, handleRegionClick]);

  const selectedRegionData = useMemo(() => {
    return selectedRegion ? getRegionData(selectedRegion) : null;
  }, [selectedRegion, getRegionData]);

  return (
    <TooltipProvider>
      <div className={cn("relative", className)}>
        <Card className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewAngle(viewAngle === 'front' ? 'back' : 'front')}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                {viewAngle === 'front' ? 'View Back' : 'View Front'}
              </Button>
              
              <div className="flex items-center gap-1 ml-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom out</TooltipContent>
                </Tooltip>
                
                <Badge variant="outline" className="mx-2">{Math.round(zoom * 100)}%</Badge>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                      disabled={zoom >= 2}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom in</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setZoom(1)}
                      className="ml-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset zoom</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {showHeatmap && (
                <Button
                  variant={showOverlay ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setShowOverlay(!showOverlay)}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Heatmap
                </Button>
              )}
              
              <Button
                variant={showPercentages ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowPercentages(!showPercentages)}
              >
                <Info className="h-4 w-4 mr-2" />
                Labels
              </Button>
              
              <Button
                variant={showGrid ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              
              {allowPhotoAnnotation && (
                <Button variant="ghost" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              )}
            </div>
          </div>

          {/* Legend */}
          {showHeatmap && showOverlay && (
            <div className="mb-4 flex items-center gap-4 text-sm">
              <span className="font-medium">Coverage:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-slate-100 border" />
                  <span>0%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-green-200" />
                  <span>1-25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-yellow-200" />
                  <span>26-50%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-orange-200" />
                  <span>51-75%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-red-200" />
                  <span>76-100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Body Model Container */}
          <div className="relative h-[600px] overflow-hidden rounded-lg bg-slate-50 border">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* SVG Body Model */}
              <svg
                viewBox="0 0 500 920"
                className="w-full h-full max-w-[500px]"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Grid overlay */}
                {showGrid && (
                  <g className="opacity-20">
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 92}
                        x2="500"
                        y2={i * 92}
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                    ))}
                    {[...Array(5)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 100}
                        y1="0"
                        x2={i * 100}
                        y2="920"
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                )}

                <AnimatePresence mode="wait">
                  <motion.g
                    key={viewAngle}
                    initial={{ opacity: 0, rotateY: viewAngle === 'front' ? -180 : 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: viewAngle === 'front' ? 180 : -180 }}
                    transition={{ duration: 0.5 }}
                  >
                    {renderBodyRegions(viewAngle)}
                  </motion.g>
                </AnimatePresence>
              </svg>
            </motion.div>
          </div>

          {/* Selected Region Detail Panel */}
          <AnimatePresence>
            {selectedRegionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 p-4 bg-slate-50 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{selectedRegionData.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRegion(null)}
                  >
                    Close
                  </Button>
                </div>
                
                {mode !== 'severity' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Area Affected</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={selectedRegionData.percentage}
                            onChange={(e) => {
                              const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                              onRegionUpdate(selectedRegionData.id, { percentage: value });
                            }}
                            className="w-20 text-center"
                            min="0"
                            max="100"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <Slider
                        value={[selectedRegionData.percentage]}
                        onValueChange={([value]) => 
                          onRegionUpdate(selectedRegionData.id, { percentage: value })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      
                      <div className="flex gap-2 mt-3">
                        {QUICK_PERCENTAGES.map(percent => (
                          <Button
                            key={percent}
                            variant={selectedRegionData.percentage === percent ? "default" : "outline"}
                            size="sm"
                            onClick={() => 
                              onRegionUpdate(selectedRegionData.id, { percentage: percent })
                            }
                            className="flex-1"
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Body Surface Area calculation for this region */}
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>BSA contribution:</span>
                        <span className="font-medium">
                          {(() => {
                            const bsaWeights = {
                              head_neck: 9,
                              trunk: 36,
                              upper_limbs: 18,
                              lower_limbs: 36
                            };
                            const weight = bsaWeights[selectedRegionData.id as keyof typeof bsaWeights] || 0;
                            const contribution = (weight * selectedRegionData.percentage) / 100;
                            return `${contribution.toFixed(1)}% of total BSA`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {mode !== 'percentage' && selectedRegionData.severity !== undefined && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Severity</Label>
                        <span className="text-sm font-medium">{selectedRegionData.severity}/3</span>
                      </div>
                      <Slider
                        value={[selectedRegionData.severity]}
                        onValueChange={([value]) => 
                          onRegionUpdate(selectedRegionData.id, { severity: value })
                        }
                        max={3}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>None</span>
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </TooltipProvider>
  );
}