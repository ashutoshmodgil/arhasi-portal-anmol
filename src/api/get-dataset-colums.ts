import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

const handleGetDatasetColumns = async ({ tableId }: { tableId: string }) => {
  const { data } = await axiosInstance.get(
    API_ROUTES.getDatasetColumns(tableId)
  );

  return data;
};

export default handleGetDatasetColumns;
