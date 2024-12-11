import axiosInstance from '@/api/interceptor';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  data_rows: Record<string, string | number>[];
  field_to_filter: string;
};

const useUniqueColumnsValues = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await axiosInstance.post(API_ROUTES.uniqueColumnValues, {
        ...payload,
      });

      return { ...data, ...payload };
    },
    onSuccess: (data) => {
      console.log('data', data);
    },
  });
};

export default useUniqueColumnsValues;
