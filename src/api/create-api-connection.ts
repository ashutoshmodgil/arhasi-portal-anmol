import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

type Props = {
  user_id: string;
  url: string;
  headers?: object;
  parameters?: object;
};

const handleCreateNewAPIConnection = async (props: Props) => {
  const { data } = await axiosInstance.post(API_ROUTES.apiConnection, {
    ...props,
  });

  return data;
};

export default handleCreateNewAPIConnection;
