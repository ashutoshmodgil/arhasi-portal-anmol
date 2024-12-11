import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

type Payload = {
  dashboard_id: string;
  datasource_id: string;
  data_rows: Record<string, string>[];
  chart_type: string;
  x_axis_columns: string[];
  y_axis_columns: string[];
  chart_name: string;
};

const useCreateNewChart = (dashboard_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await axiosInstance.post(API_ROUTES.charts, {
        ...payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard-charts', dashboard_id],
      });
    },
  });
};

export default useCreateNewChart;
