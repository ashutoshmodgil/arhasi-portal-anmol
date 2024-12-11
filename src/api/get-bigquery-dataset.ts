import Cookies from 'js-cookie';
import axios from 'axios';
import { API_DOMAIN } from '@/config';
import { API_ROUTES } from '@/routes/apiRoutes';

const handleGetDatasets = async () => {
  try {
    const { data } = await axios.get(API_DOMAIN + API_ROUTES.getDatasets, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });

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

export default handleGetDatasets;
