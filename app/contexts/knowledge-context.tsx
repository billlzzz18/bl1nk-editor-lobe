"use client";

import { createContext, useContext, useRef, useEffect, type ReactNode } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  embedding?: number[];
  metadata: {
    author: string;
    version: string;
    language: string;
    wordCount: number;
  };
}

interface SearchResult extends KnowledgeDocument {
  relevance_score: number;
  excerpt: string;
}

interface KnowledgeStore {
  // State
  documents: KnowledgeDocument[];
  searchResults: SearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // Actions
  loadDocuments: () => Promise<void>;
  searchKnowledge: (query: string) => Promise<SearchResult[]>;
  addDocument: (document: KnowledgeDocument) => void;
  updateDocument: (documentId: string, updates: Partial<KnowledgeDocument>) => void;
  deleteDocument: (documentId: string) => void;
  clearError: () => void;
}

const useKnowledgeStore = create<KnowledgeStore>()(
  immer((set, get) => ({
    // Initial state
    documents: [],
    searchResults: [],
    isLoading: false,
    isSearching: false,
    error: null,

    // Actions
    loadDocuments: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await fetch('/api/v1/knowledge/mock');
        const result = await response.json();
        
        if (result.success) {
          set((state) => {
            state.documents = result.data;
            state.isLoading = false;
          });
        } else {
          throw new Error(result.error || "Failed to load documents");
        }
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : "Failed to load documents";
        });
      }
    },

    searchKnowledge: async (query: string) => {
      set((state) => {
        state.isSearching = true;
        state.error = null;
      });

      try {
        const response = await fetch('/api/v1/knowledge/mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          set((state) => {
            state.searchResults = result.results;
            state.isSearching = false;
          });
          return result.results;
        } else {
          throw new Error(result.error || "Search failed");
        }
      } catch (error) {
        set((state) => {
          state.isSearching = false;
          state.error = error instanceof Error ? error.message : "Search failed";
        });
        return [];
      }
    },

    addDocument: (document: KnowledgeDocument) => {
      set((state) => {
        state.documents.push(document);
      });
    },

    updateDocument: (documentId: string, updates: Partial<KnowledgeDocument>) => {
      set((state) => {
        const docIndex = state.documents.findIndex(doc => doc.id === documentId);
        if (docIndex >= 0) {
          Object.assign(state.documents[docIndex], updates);
          state.documents[docIndex].updatedAt = new Date().toISOString();
        }
      });
    },

    deleteDocument: (documentId: string) => {
      set((state) => {
        state.documents = state.documents.filter(doc => doc.id !== documentId);
        state.searchResults = state.searchResults.filter(result => result.id !== documentId);
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);

interface KnowledgeProviderProps {
  children: ReactNode;
}

const KnowledgeStoreContext = createContext<KnowledgeStore | null>(null);

export function KnowledgeProvider({ children }: KnowledgeProviderProps) {
  const store = useKnowledgeStore();

  // Auto-load documents on provider mount
  useEffect(() => {
    store.loadDocuments();
  }, []);

  return (
    <KnowledgeStoreContext.Provider value={store}>
      {children}
    </KnowledgeStoreContext.Provider>
  );
}

export function useKnowledgeStoreApi() {
  const knowledgeStoreContext = useContext(KnowledgeStoreContext);

  if (!knowledgeStoreContext) {
    throw new Error("useKnowledgeStoreApi must be used within a KnowledgeProvider");
  }

  return knowledgeStoreContext;
}

// Convenience hooks
export function useKnowledgeBase() {
  const store = useKnowledgeStoreApi();
  return {
    documents: store.documents,
    searchResults: store.searchResults,
    isLoading: store.isLoading,
    isSearching: store.isSearching,
    error: store.error,
    loadDocuments: store.loadDocuments,
    searchKnowledge: store.searchKnowledge,
    addDocument: store.addDocument,
    updateDocument: store.updateDocument,
    deleteDocument: store.deleteDocument,
    clearError: store.clearError,
  };
}