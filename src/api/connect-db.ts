import { API_ROUTES } from '@/routes/apiRoutes';
import axiosInstance from './interceptor';

type Props = {
  tableId: string;
};

const handleConnectDatabase = async (props: Props) => {
  const { data } = await axiosInstance.post(API_ROUTES.connectDb, {
    datasource: 'bigquery',
    table: props.tableId,
  });
  return data;
};

export default handleConnectDatabase;
