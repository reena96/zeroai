import { create } from 'zustand';
import { nanoid } from 'nanoid';

// Message interface matching architecture specification
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system'; // Added 'system' for confused button injection
  content: string;
  timestamp: number;
}

// Session mode type for context-aware learning
export type SessionMode = 'homework' | 'exam' | 'explore' | null;

// Conversation metadata for tracking student interactions (Story 2.4)
export interface ConversationMetadata {
  confusedClicked: boolean;
  confusedClickTimestamp: number | null;
  paceCheckShown: boolean;
}

// Chat store state interface
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionMode: SessionMode;
  metadata: ConversationMetadata;
  addMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setSessionMode: (mode: SessionMode) => void;
  triggerConfusedClick: () => Promise<void>;
}

// Create Zustand store
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  sessionMode: null, // Start with no mode selected
  metadata: {
    confusedClicked: false,
    confusedClickTimestamp: null,
    paceCheckShown: false,
  },

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
    set({
      messages: [],
      metadata: {
        confusedClicked: false,
        confusedClickTimestamp: null,
        paceCheckShown: false,
      },
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setSessionMode: (mode) => {
    set({ sessionMode: mode });
  },

  // Story 2.4: Trigger confused button - injects system message and calls API
  triggerConfusedClick: async () => {
    const { messages, sessionMode, isLoading } = get();

    // Prevent multiple simultaneous clicks
    if (isLoading) return;

    // Inject system message to trigger worked example
    const systemMessage: Message = {
      id: nanoid(),
      role: 'system',
      content:
        "The student clicked 'I'm really confused'. Please provide a worked example of a SIMILAR problem with step-by-step solution.",
      timestamp: Date.now(),
    };

    // Update metadata
    set((state) => ({
      messages: [...state.messages, systemMessage],
      metadata: {
        ...state.metadata,
        confusedClicked: true,
        confusedClickTimestamp: Date.now(),
      },
      isLoading: true,
    }));

    try {
      // Get updated messages array (includes system message)
      const updatedMessages = get().messages;

      // Call API with system message included
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionMode: sessionMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      // Create a new message for the AI response
      let aiResponse = '';
      const addMsg = get().addMessage;

      // Add initial empty message
      addMsg('assistant', '');
      const currentMessages = get().messages;
      const aiMessageIndex = currentMessages.length - 1;

      // Read streaming chunks
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode chunk and append to response
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Update the last message in the store with accumulated response
        const messages = get().messages;
        const updatedMessages = [...messages];
        updatedMessages[aiMessageIndex] = {
          ...updatedMessages[aiMessageIndex],
          content: aiResponse,
        };
        set({ messages: updatedMessages });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Error calling API:', error);
      set({ isLoading: false });

      // Add error message
      const addMsg = get().addMessage;
      addMsg(
        'assistant',
        "Sorry, I encountered an error. Please check your API key configuration and try again."
      );
    }
  },
}));
