import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const MemoizedCard = memo(Card);
export const MemoizedCardContent = memo(CardContent);
export const MemoizedCardDescription = memo(CardDescription);
export const MemoizedCardFooter = memo(CardFooter);
export const MemoizedCardHeader = memo(CardHeader);
export const MemoizedCardTitle = memo(CardTitle);