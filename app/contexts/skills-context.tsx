"use client";

import { createContext, useContext, useRef, useEffect, type ReactNode } from "react";
import { useStore } from "zustand";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import skillsMockData from "@/mock-data/skills-mock.json";
import type { Skill } from "@/types/skills.types";

interface SkillsStore {
  // State
  skills: Skill[];
  selectedSkill: Skill | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSkills: () => Promise<void>;
  selectSkill: (skill: Skill | null) => void;
  clearError: () => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skillId: string, updates: Partial<Skill>) => void;
  deleteSkill: (skillId: string) => void;
}

const useSkillsStore = create<SkillsStore>()(
  immer((set, get) => ({
    // Initial state
    skills: [],
    selectedSkill: null,
    isLoading: false,
    error: null,

    // Actions
    fetchSkills: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Transform mock data to match expected format
        const transformedSkills = skillsMockData.map((skill: any) => ({
          id: skill.id,
          name: skill.name,
          description: skill.description,
          category: skill.category,
          language: skill.language,
          version: skill.version,
          status: skill.status,
          tools: skill.tools,
          tags: skill.tags,
          endpoint: skill.endpoint,
          author: skill.author,
          created_at: skill.createdAt,
          updated_at: skill.lastUpdated,
          metadata: {
            display_title: skill.name,
            source: skill.author === "MiniMax Agent" ? "official" : "community",
            example: skill.example,
            parameters: skill.parameters
          }
        }));

        set((state) => {
          state.skills = transformedSkills;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : "Failed to load skills";
        });
      }
    },

    selectSkill: (skill: Skill | null) => {
      set((state) => {
        state.selectedSkill = skill;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    addSkill: (skill: Skill) => {
      set((state) => {
        state.skills.push(skill);
      });
    },

    updateSkill: (skillId: string, updates: Partial<Skill>) => {
      set((state) => {
        const skillIndex = state.skills.findIndex(s => s.id === skillId);
        if (skillIndex >= 0) {
          Object.assign(state.skills[skillIndex], updates);
        }
      });
    },

    deleteSkill: (skillId: string) => {
      set((state) => {
        state.skills = state.skills.filter(s => s.id !== skillId);
        if (state.selectedSkill?.id === skillId) {
          state.selectedSkill = null;
        }
      });
    },
  }))
);

interface SkillsProviderProps {
  children: ReactNode;
}

const SkillsStoreContext = createContext<SkillsStore | null>(null);

export function SkillsProvider({ children }: SkillsProviderProps) {
  const store = useSkillsStore();

  // Auto-fetch skills on provider mount
  useEffect(() => {
    store.fetchSkills();
  }, []);

  return (
    <SkillsStoreContext.Provider value={store}>
      {children}
    </SkillsStoreContext.Provider>
  );
}

export function useSkillsStoreApi() {
  const skillsStoreContext = useContext(SkillsStoreContext);

  if (!skillsStoreContext) {
    throw new Error("useSkillsStoreApi must be used within a SkillsProvider");
  }

  return skillsStoreContext;
}

// Convenience hooks
export function useSkills() {
  const store = useSkillsStoreApi();
  return {
    skills: store.skills,
    isLoading: store.isLoading,
    error: store.error,
    fetchSkills: store.fetchSkills,
    clearError: store.clearError,
    addSkill: store.addSkill,
    updateSkill: store.updateSkill,
    deleteSkill: store.deleteSkill,
  };
}

export function useSelectedSkill() {
  const store = useSkillsStoreApi();
  return {
    selectedSkill: store.selectedSkill,
    selectSkill: store.selectSkill,
  };
}