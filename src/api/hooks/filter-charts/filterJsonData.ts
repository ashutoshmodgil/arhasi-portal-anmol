import axiosInstance from '@/api/interceptor';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  data_rows: Record<string, string | number>[];
  field_to_filter: string;
  values_to_filter: Array<string | number>;
  chart_id: string;
};

const useFilterJSONData = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await axiosInstance.post(API_ROUTES.filterJsonData, {
        ...payload,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log('data', data);
    },
  });
};

export default useFilterJSONData;
