import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPatient,
  getPatient,
  listPatientsForUser,
  updatePatient,
  type PatientRecord,
} from '../services/patientService';
import { useAuth } from './useAuth';

export const patientsQueryKey = (userId: string) => ['patients', userId];
export const patientQueryKey = (patientId: string) => ['patient', patientId];

export const usePatients = () => {
  const { user } = useAuth();
  return useQuery<PatientRecord[]>({
    queryKey: user ? patientsQueryKey(user.uid) : ['patients', 'anonymous'],
    queryFn: async () => {
      if (!user) return [];
      return listPatientsForUser(user.uid);
    },
    enabled: Boolean(user),
  });
};

export const usePatient = (patientId?: string) =>
  useQuery<PatientRecord | null>({
    queryKey: patientId ? patientQueryKey(patientId) : ['patient', 'unknown'],
    queryFn: async () => {
      if (!patientId) return null;
      return getPatient(patientId);
    },
    enabled: Boolean(patientId),
  });

export const useCreatePatient = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ displayId, notes }: { displayId: string; notes?: string }) => {
      if (!user) throw new Error('Must be signed in.');
      const id = await createPatient({
        displayId,
        notes,
        ownerUserId: user.uid,
      });
      return id;
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: patientsQueryKey(user.uid) });
    },
  });
};

export const useUpdatePatient = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatient,
    onSuccess: async (_, variables) => {
      if (!user) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientsQueryKey(user.uid) }),
        queryClient.invalidateQueries({ queryKey: patientQueryKey(variables.patientId) }),
      ]);
    },
  });
};
