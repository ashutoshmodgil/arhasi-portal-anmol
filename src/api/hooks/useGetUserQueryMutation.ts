import { useMutation } from '@tanstack/react-query';
import handleGetUserQuery from '../get-user-query';
import useDataSetColumnsStore from '@/store/useDataSetColumns';

const useGetUserQueryMutation = () => {
  return useMutation({
    mutationFn: handleGetUserQuery,
    onSuccess(data) {
      useDataSetColumnsStore.getState().setQuestions(data.questions);
    },
  });
};

export default useGetUserQueryMutation;
