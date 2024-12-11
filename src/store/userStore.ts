import { USER_STORE } from '@/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: {
    access_token: string | null;
    user_id: string | null;
    user_email: string | null;
    user_firstname: string | null;
    user_lastname: string | null;
  };
  isLoggedIn: boolean;
  setUser: (user: UserState['user']) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: {
        access_token: null,
        user_id: null,
        user_email: null,
        user_firstname: null,
        user_lastname: null,
      },
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      logout: () =>
        set({
          user: {
            access_token: null,
            user_id: null,
            user_email: null,
            user_firstname: null,
            user_lastname: null,
          },
          isLoggedIn: false,
        }),
    }),
    {
      name: USER_STORE,
    }
  )
);

export default useUserStore;
