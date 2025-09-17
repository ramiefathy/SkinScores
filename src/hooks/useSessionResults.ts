import { useQuery } from '@tanstack/react-query';
import { listResultsForSessions, type ScoreResultRecord } from '../services/scoreResultService';

export const sessionResultsQueryKey = (sessionIds: string[]) => ['sessionResults', ...sessionIds];

export const useSessionResults = (sessionIds: string[]) =>
  useQuery<ScoreResultRecord[]>({
    queryKey: sessionResultsQueryKey(sessionIds),
    queryFn: () => listResultsForSessions(sessionIds),
    enabled: sessionIds.length > 0,
  });
