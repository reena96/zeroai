import { create } from 'zustand';
import { nanoid } from 'nanoid';

// Message interface matching architecture specification
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Chat store state interface
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

// Create Zustand store
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (role, content) => {
    const newMessage: Message = {
      id: nanoid(),
      role,
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
