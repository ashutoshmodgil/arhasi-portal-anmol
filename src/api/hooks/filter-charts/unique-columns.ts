import axiosInstance from '@/api/interceptor';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  data_rows: Record<string, string | number>[];
};

const useUniqueColumns = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await axiosInstance.post(API_ROUTES.uniqueColumns, {
        ...payload,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log('data', data);
    },
  });
};

export default useUniqueColumns;
