import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

const useUpdateDashboard = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async ({
      dashboard_id,
      dashboard_name,
    }: {
      dashboard_id: string;
      dashboard_name: string;
    }) => {
      const { data } = await axiosInstance.put(
        API_ROUTES.updateDashboard(dashboard_id, dashboard_name)
      );
      return data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export default useUpdateDashboard;
