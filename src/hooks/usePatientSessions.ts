import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { listSessionsForPatient, type ScoreSessionRecord } from '../services/scoreSessionService';

export const patientSessionsQueryKey = (patientId: string, userId?: string) => [
  'patientSessions',
  patientId,
  userId ?? 'any',
];

export const usePatientSessions = (patientId?: string) => {
  const { user } = useAuth();
  return useQuery<ScoreSessionRecord[]>({
    queryKey: patientId
      ? patientSessionsQueryKey(patientId, user?.uid)
      : ['patientSessions', 'unknown'],
    queryFn: async () => {
      if (!patientId) return [];
      return listSessionsForPatient(patientId, user?.uid ?? undefined);
    },
    enabled: Boolean(patientId && user),
  });
};
