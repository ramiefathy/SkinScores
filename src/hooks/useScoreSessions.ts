import { useQuery } from '@tanstack/react-query';
import { listSessionsForUser, type ScoreSessionRecord } from '../services/scoreSessionService';
import { useAuth } from './useAuth';

export const sessionsQueryKey = (userId: string) => ['scoreSessions', userId];

export const useScoreSessions = () => {
  const { user } = useAuth();

  return useQuery<ScoreSessionRecord[]>({
    queryKey: user ? sessionsQueryKey(user.uid) : ['scoreSessions', 'anonymous'],
    queryFn: async () => {
      if (!user) return [];
      return listSessionsForUser(user.uid);
    },
    enabled: Boolean(user),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
