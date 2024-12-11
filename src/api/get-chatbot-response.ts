import axios from 'axios';
import Cookies from 'js-cookie';
import { API_DOMAIN } from '@/config';
import { API_ROUTES } from '@/routes/apiRoutes';


interface ChatBotRequest {
  tableId: string;
  user_query: string;
}

export const chatBotMessage = async (payload: ChatBotRequest) => {
 const {tableId,user_query}=payload
  try {
    const { data } = await axios.post(
      `${API_DOMAIN}${API_ROUTES.dashboard_agent_chat}`,
      {user_query, datasource:'bigquery',db:'',session_id: "121", table: tableId},
     
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
      alert(`Error: ${error.message}`);
    } else {
      alert('Something went wrong');
    }
    throw new Error('Something went wrong');
  }
};