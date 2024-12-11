import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../interceptor';

const useGetDashboardById = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async ({
      dashboard_id,
      formData,
    }: {
      dashboard_id: string;
      formData: FormData;
    }) => {
      const { data } = await axiosInstance.post(
        API_ROUTES.upload_image(dashboard_id),
        formData
      );
      return data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export default useGetDashboardById;
