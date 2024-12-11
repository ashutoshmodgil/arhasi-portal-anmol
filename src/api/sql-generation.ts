import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';
import { SchemaData } from '@/store/useDataSetColumns';

type Payload = {
  user_query: string;
  schema: SchemaData;
  columns:string[];
};

const handleSqlGenerationMutation = async ({
  payload,
}: {
  payload: Payload;
}) => {
  const { data } = await axiosInstance.post(API_ROUTES.sqlGeneration, {
    user_query: payload.user_query,
    ...payload.schema,
    columns: payload.columns
  });

  return data;
};

export default handleSqlGenerationMutation;
