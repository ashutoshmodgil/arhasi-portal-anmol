import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

const useGetDashboardById = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async ({ dashboard_id }: { dashboard_id: string }) => {
      const { data } = await axiosInstance.post(
        API_ROUTES.get_dashboard_by_id(dashboard_id)
      );
      return data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export default useGetDashboardById;
