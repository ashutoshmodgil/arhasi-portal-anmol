import { CHATBOT_STORE } from '@/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatBotState {
  chatbot: {
    access_token: string | null;
    chatbot_id: string | null;
    chatbot_email: string | null;
    chatbot_firstname: string | null;
    chatbot_lastname: string | null;
  };
  isLoggedIn: boolean;
  setChatBot: (chatbot: ChatBotState['chatbot']) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

const useChatBotStore = create(
  persist<ChatBotState>(
    (set) => ({
      chatbot: {
        access_token: null,
        chatbot_id: null,
        chatbot_email: null,
        chatbot_firstname: null,
        chatbot_lastname: null,
      },
      isLoggedIn: false,
      setChatBot: (chatbot) => set({ chatbot }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      logout: () =>
        set({
          chatbot: {
            access_token: null,
            chatbot_id: null,
            chatbot_email: null,
            chatbot_firstname: null,
            chatbot_lastname: null,
          },
          isLoggedIn: false,
        }),
    }),
    {
      name: CHATBOT_STORE,
    }
  )
);

export default useChatBotStore;
