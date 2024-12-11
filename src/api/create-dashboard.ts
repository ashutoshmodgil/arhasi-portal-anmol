import { API_DOMAIN } from '@/config';
import { API_ROUTES } from '@/routes/apiRoutes';
import axios from 'axios';
import Cookies from 'js-cookie';

type Props = {
  dashboard_name: string;
};

const handleCreateDashboard = async (props: Props) => {
  try {
    const { data } = await axios.post(
      API_DOMAIN + API_ROUTES.dashboard,
      {
        dashboard_name: props.dashboard_name,
      },
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
    throw new Error('Something went wrong');
  }
};

export default handleCreateDashboard;
