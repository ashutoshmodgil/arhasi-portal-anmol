import { useQuery } from '@tanstack/react-query';
import handleGetDatasetColumns from '../get-dataset-colums';

const useGetDatasetColumns = ({ tableId }: { tableId: string }) => {
  return useQuery({
    queryKey: ['dataset-columns', tableId],
    queryFn: () => handleGetDatasetColumns({ tableId }),
    enabled: !!tableId,
  });
};

export default useGetDatasetColumns;
