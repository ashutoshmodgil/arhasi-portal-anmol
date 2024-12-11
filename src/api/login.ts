import axios from 'axios';
import Cookies from 'js-cookie';

import queryString from 'query-string';

import { API_DOMAIN } from '@/config';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const data = { username: email, password };

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: queryString.stringify(data),
      url: `${API_DOMAIN}/token`,
    };

    const response = await axios(options);
    const { access_token } = response.data;

    Cookies.set('token', access_token, { secure: true, expires: 1 });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.detail || 'Login failed';
    }

    throw 'An unexpected error occurred';
  }
};
