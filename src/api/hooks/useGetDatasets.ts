import { useQuery } from '@tanstack/react-query';
import handleGetDatasets from '../get-bigquery-dataset';

export const useGetDatasets = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: handleGetDatasets,
    enabled,
  });
};
