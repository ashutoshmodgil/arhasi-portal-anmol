import { useMutation } from '@tanstack/react-query';
import handleGetSchemaMutation from '../get-schema';
import useDataSetColumnsStore from '@/store/useDataSetColumns';

const useGetSchemaMutation = () => {
  return useMutation({
    mutationFn: handleGetSchemaMutation,
    onSuccess(data) {
      console.log('schema - -- - - - --', data);
      useDataSetColumnsStore.getState().setSchema(data);
    },
  });
};

export default useGetSchemaMutation;
