import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../interceptor';
import { toast } from '@/hooks/use-toast';

const useUpdateChartName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dashboard_id,
      chart_id,
      chart_name,
    }: {
      dashboard_id: string;
      chart_id: string;
      chart_name: string;
    }) => {
      const { data } = await axiosInstance.put(
        `/edit_chart_name?dashboard_id=${dashboard_id}&chart_id=${chart_id}&chart_name=${chart_name}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the dashboard charts query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['dashboard-charts', variables.dashboard_id],
      });
      toast({
        title: 'Chart name updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update chart name',
        variant: 'destructive',
      });
    },
  });
};

export default useUpdateChartName;