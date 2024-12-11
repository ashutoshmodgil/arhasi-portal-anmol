import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

const useDeleteChart = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async ({
      dashboard_id,
      chart_id,
    }: {
      dashboard_id: string;
      chart_id: string;
    }) => {
      const { data } = await axiosInstance.delete(
        API_ROUTES.deleteChart(dashboard_id, chart_id)
      );
      return data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export default useDeleteChart;
