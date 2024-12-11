import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

type Payload = {
  user_query: string;
  columns: string[];
  datasource: string;
  db: string;
  table_name: string;
};

const handleChartDetailsGenerationMutation = async ({
  payload,
}: {
  payload: Payload;
}) => {
  const { data } = await axiosInstance.post(API_ROUTES.chartDetailsGeneration, {
    user_query: payload.user_query,
    columns: payload.columns,
    datasource: payload.datasource,
    db: payload.db,
    table_name: payload.table_name,
  });

  return data;
};

export default handleChartDetailsGenerationMutation;