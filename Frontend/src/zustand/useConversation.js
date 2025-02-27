// useConversation.js - Improved Zustand store with better typing and additional functionality
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useConversation = create(
  persist(
    (set, get) => ({
      // Main conversation state
      selectedConversation: null,
      conversations: [],
      messages: [],
      
      // Actions for conversation management
      setSelectedConversation: (conversation) => {
        set({ selectedConversation: conversation });
      },
      
      addConversation: (conversation) => {
        const conversations = get().conversations;
        // Check if conversation already exists
        const exists = conversations.some(c => c.userId === conversation.userId);
        if (!exists) {
          set({ conversations: [...conversations, conversation] });
        }
      },
      
      // Message management
      setMessages: (messages) => set({ messages }),
      
      addMessage: (message) => {
        const messages = get().messages;
        set({ messages: [...messages, message] });
      },
      
      updateMessage: (messageId, updates) => {
        const messages = get().messages;
        set({
          messages: messages.map(msg => 
            msg._id === messageId ? { ...msg, ...updates } : msg
          )
        });
      },
      
      deleteMessage: (messageId) => {
        const messages = get().messages;
        set({
          messages: messages.filter(msg => msg._id !== messageId)
        });
      },
      
      // Clear all data
      clearConversationData: () => {
        set({ 
          selectedConversation: null,
          conversations: [],
          messages: []
        });
      }
    }),
    {
      name: "conversation-storage", // Storage key
      partialize: (state) => ({
        // Only persist these fields
        conversations: state.conversations,
      }),
    }
  )
);

export default useConversation;