import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../interceptor';
import { toast } from '@/hooks/use-toast';

const useRefreshChartData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chart_id }: { chart_id: string }) => {
      const { data } = await axiosInstance.post(
        `/refresh-data/${chart_id}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the dashboard charts query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['dashboard-charts'] });
      toast({
        title: 'Chart data refreshed successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to refresh chart data',
        variant: 'destructive',
      });
    },
  });
};

export default useRefreshChartData;