import { useMutation } from '@tanstack/react-query';
import handleSqlGenerationMutation from '../sql-generation';
import useDataSetColumnsStore from '@/store/useDataSetColumns';

const useSqlGenerationMutation = () => {
  return useMutation({
    mutationFn: handleSqlGenerationMutation,
    onSuccess(data) {
      useDataSetColumnsStore.getState().setSqlGeneratedData(data);
    },
  });
};

export default useSqlGenerationMutation;
