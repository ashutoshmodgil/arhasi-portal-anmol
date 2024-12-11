import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

type GetUserQueryParams = {
  columns: string[];
  metadata: any;
  datasource: string;
  db: string;
  table_name: string;
};

const handleGetUserQuery = async ({ 
  columns, 
  metadata, 
  datasource, 
  db, 
  table_name 
}: GetUserQueryParams) => {
  const { data } = await axiosInstance.post(API_ROUTES.getUserQuery, {
    columns,
    metadata,
    datasource,
    db,
    table_name
  });

  return data;
};

export default handleGetUserQuery;