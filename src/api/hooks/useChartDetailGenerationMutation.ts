import { useMutation } from '@tanstack/react-query';
import handleChartDetailsGenerationMutation from '../chart-detail-generation';

const useChartDetailGenerationMutation = () => {
  return useMutation({
    mutationFn: handleChartDetailsGenerationMutation,
    onSuccess(data) {
      console.log({ data });
    },
  });
};

export default useChartDetailGenerationMutation;