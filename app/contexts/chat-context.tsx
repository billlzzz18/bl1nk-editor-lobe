"use client";

import { createContext, useContext, useRef, useEffect, type ReactNode } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    skills_used?: string[];
    files_modified?: string[];
    execution_time?: number;
    context_sources?: string[];
    code_execution?: {
      language: string;
      code: string;
      output?: string;
      error?: string;
    };
  };
}

interface ChatStore {
  // State
  messages: ChatMessage[];
  isTyping: boolean;
  currentMessage: string;
  error: string | null;
  
  // Actions
  sendMessage: (content: string, context?: any) => Promise<void>;
  setCurrentMessage: (message: string) => void;
  clearMessages: () => void;
  clearError: () => void;
  deleteMessage: (messageId: string) => void;
}

const useChatStore = create<ChatStore>()(
  immer((set, get) => ({
    // Initial state
    messages: [],
    isTyping: false,
    currentMessage: '',
    error: null,

    // Actions
    sendMessage: async (content: string, context?: any) => {
      const { messages } = get();
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
        metadata: context
      };

      set((state) => {
        state.messages.push(userMessage);
        state.isTyping = true;
        state.error = null;
      });

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const response = await fetch('/api/v1/chat/mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            context
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          const assistantMessage: ChatMessage = {
            id: result.message.id,
            role: 'assistant',
            content: result.message.content,
            timestamp: new Date(result.message.timestamp),
            metadata: result.message.metadata
          };

          set((state) => {
            state.messages.push(assistantMessage);
            state.isTyping = false;
            state.currentMessage = '';
          });
        } else {
          throw new Error(result.error || "Failed to get response");
        }
      } catch (error) {
        set((state) => {
          state.isTyping = false;
          state.error = error instanceof Error ? error.message : "Failed to send message";
        });

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          timestamp: new Date()
        };

        set((state) => {
          state.messages.push(errorMessage);
        });
      }
    },

    setCurrentMessage: (message: string) => {
      set((state) => {
        state.currentMessage = message;
      });
    },

    clearMessages: () => {
      set((state) => {
        state.messages = [];
        state.currentMessage = '';
        state.error = null;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    deleteMessage: (messageId: string) => {
      set((state) => {
        state.messages = state.messages.filter(msg => msg.id !== messageId);
      });
    },
  }))
);

interface ChatProviderProps {
  children: ReactNode;
}

const ChatStoreContext = createContext<ChatStore | null>(null);

export function ChatProvider({ children }: ChatProviderProps) {
  const store = useChatStore();

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStoreApi() {
  const chatStoreContext = useContext(ChatStoreContext);

  if (!chatStoreContext) {
    throw new Error("useChatStoreApi must be used within a ChatProvider");
  }

  return chatStoreContext;
}

// Convenience hooks
export function useChat() {
  const store = useChatStoreApi();
  return {
    messages: store.messages,
    isTyping: store.isTyping,
    currentMessage: store.currentMessage,
    error: store.error,
    sendMessage: store.sendMessage,
    setCurrentMessage: store.setCurrentMessage,
    clearMessages: store.clearMessages,
    clearError: store.clearError,
    deleteMessage: store.deleteMessage,
  };
}

export function useChatHistory() {
  const { messages } = useChat();
  return {
    history: messages,
    messageCount: messages.length,
    userMessageCount: messages.filter(m => m.role === 'user').length,
    assistantMessageCount: messages.filter(m => m.role === 'assistant').length,
  };
}