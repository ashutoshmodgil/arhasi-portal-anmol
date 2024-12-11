import { API_DOMAIN } from '@/config';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

type Props = {
  dashboard_id: string;
};

const useGetDashboardCharts = ({ dashboard_id }: { dashboard_id: string }) => {
  return useQuery({
    queryKey: ['dashboard-charts', dashboard_id],
    queryFn: () => handleGetDashboardCharts({ dashboard_id }),
    enabled: !!dashboard_id,
  });
};

const handleGetDashboardCharts = async (props: Props) => {
  try {
    const { data } = await axios.get(
      API_DOMAIN + API_ROUTES.getDashboardCharts(props.dashboard_id),
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Optional: handle specific Axios errors here
      alert(`Error: ${error.message}`);
    } else {
      alert('Something went wrong');
    }
  }
};

export default useGetDashboardCharts;
