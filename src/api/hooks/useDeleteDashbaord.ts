import { API_ROUTES } from '@/routes/apiRoutes';
import useUserStore from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

const useDeleteDashboard = ({ onSuccess }: { onSuccess: () => void }) => {
  const user_id = useUserStore.getState().user.user_id || '';

  return useMutation({
    mutationFn: async (dashboard_id: string) => {
      console.log(API_ROUTES.deleteDashboard(user_id, dashboard_id));
      const { data } = await axiosInstance.delete(
        API_ROUTES.deleteDashboard(user_id, dashboard_id)
      );
      return data;
    },
    onSuccess: () => {
      onSuccess();
    },
  });
};

export default useDeleteDashboard;
