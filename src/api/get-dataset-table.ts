import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

const handleGetDatasetsTables = async ({ dataset }: { dataset: string }) => {
  const { data } = await axiosInstance.get(
    API_ROUTES.getDatasetsTables(dataset)
  );

  return data;
};

export default handleGetDatasetsTables;
