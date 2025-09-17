import { useMutation } from '@tanstack/react-query';
import { callGenerateResultExport } from '../firebase/functions';

export const useResultExport = () =>
  useMutation({
    mutationFn: async (sessionIds: string[]) => {
      if (sessionIds.length === 0) {
        throw new Error('Select at least one session to export.');
      }
      const response = await callGenerateResultExport({ sessionIds });
      return response.data;
    },
  });
