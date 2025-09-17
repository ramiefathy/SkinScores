import { useQuery } from '@tanstack/react-query';
import { listRecentAggregates, type AggregateSnapshot } from '../services/aggregateService';

export const aggregatesQueryKey = (templateId?: string) => [
  'aggregateSnapshots',
  templateId ?? 'all',
];

export const useAggregates = (templateId?: string) =>
  useQuery<AggregateSnapshot[]>({
    queryKey: aggregatesQueryKey(templateId),
    queryFn: () => listRecentAggregates(templateId),
  });
