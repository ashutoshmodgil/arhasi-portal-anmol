import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';

import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from '../interceptor';

const useGetUserDashboards = () => {
  const user_id = useUserStore.getState().user.user_id || '';
  return useQuery({
    queryKey: ['user-dashboards', user_id],
    queryFn: () => handleGetUserDashboards({ user_id }),
    enabled: !!user_id,
  });
};

const handleGetUserDashboards = async ({ user_id }: { user_id: string }) => {
  const { data } = await axiosInstance.get(
    API_ROUTES.getUserDashboards(user_id)
  );

  return data;
};

export default useGetUserDashboards;
