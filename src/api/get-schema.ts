import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

type Payload = {
  datasource: string;
  table: string;
};

const handleGetSchemaMutation = async ({ payload }: { payload: Payload }) => {
  const { data } = await axiosInstance.post(API_ROUTES.getSchema, {
    ...payload,
  });

  return data;
};

export default handleGetSchemaMutation;
