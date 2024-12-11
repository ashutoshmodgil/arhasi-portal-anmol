import { useQuery } from '@tanstack/react-query';
import handleGetDatasetsTables from '../get-dataset-table';

const useGetDatasetsTables = (dataset: string) => {
  return useQuery({
    queryKey: ['datasetsTables', dataset],
    queryFn: () => handleGetDatasetsTables({ dataset }),
    enabled: !!dataset,
  });
};

export default useGetDatasetsTables;
