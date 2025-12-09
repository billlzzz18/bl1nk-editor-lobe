/**
 * API client and utilities for AI Development Studio
 */

import { ApiClient } from './utils';

// Create API client instance
export const apiClient = new ApiClient();

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  
  // Skills
  SKILLS: {
    LIST: '/api/v1/skills',
    DETAIL: (id: string) => `/api/v1/skills/${id}`,
    VERSIONS: (id: string) => `/api/v1/skills/${id}/versions`,
    VERSION: (id: string, version: string) => `/api/v1/skills/${id}/versions/${version}`,
    CREATE: '/api/v1/skills',
    UPDATE: (id: string) => `/api/v1/skills/${id}`,
    DELETE: (id: string) => `/api/v1/skills/${id}`,
    EXECUTE: (id: string) => `/api/v1/skills/${id}/execute`,
  },
  
  // Files
  FILES: {
    LIST: '/api/v1/files',
    DETAIL: (id: string) => `/api/v1/files/${id}`,
    CONTENT: (id: string) => `/api/v1/files/${id}/content`,
    CREATE: '/api/v1/files',
    UPDATE: (id: string) => `/api/v1/files/${id}`,
    DELETE: (id: string) => `/api/v1/files/${id}`,
  },
  
  // Messages
  MESSAGES: {
    LIST: '/api/v1/messages',
    CREATE: '/api/v1/messages',
    UPDATE: (id: string) => `/api/v1/messages/${id}`,
    DELETE: (id: string) => `/api/v1/messages/${id}`,
  },
  
  // Stats
  STATS: '/api/stats',
  
  // Health
  HEALTH: '/api/health',
  
  // Notion Sync
  NOTION_SYNC: '/api/notion-sync',
};

// Authentication API functions
export const authApi = {
  async login(credentials: { email: string; password: string }) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  async register(userData: { 
    email: string; 
    password: string; 
    name: string;
    confirmPassword?: string;
  }) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
  
  async logout() {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  async refresh() {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
  
  async getProfile() {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },
};

// Skills API functions
export const skillsApi = {
  async listSkills(params?: { page?: number; limit?: number; search?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiClient.get(`${API_ENDPOINTS.SKILLS.LIST}${queryString}`);
  },
  
  async getSkill(id: string) {
    return apiClient.get(API_ENDPOINTS.SKILLS.DETAIL(id));
  },
  
  async createSkill(skillData: any) {
    return apiClient.post(API_ENDPOINTS.SKILLS.CREATE, skillData);
  },
  
  async updateSkill(id: string, skillData: any) {
    return apiClient.put(API_ENDPOINTS.SKILLS.UPDATE(id), skillData);
  },
  
  async deleteSkill(id: string) {
    return apiClient.delete(API_ENDPOINTS.SKILLS.DELETE(id));
  },
  
  async executeSkill(id: string, input?: any) {
    return apiClient.post(API_ENDPOINTS.SKILLS.EXECUTE(id), { input });
  },
  
  async getSkillVersions(id: string) {
    return apiClient.get(API_ENDPOINTS.SKILLS.VERSIONS(id));
  },
  
  async getSkillVersion(id: string, version: string) {
    return apiClient.get(API_ENDPOINTS.SKILLS.VERSION(id, version));
  },
};

// Files API functions
export const filesApi = {
  async listFiles(params?: { page?: number; limit?: number; skillId?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiClient.get(`${API_ENDPOINTS.FILES.LIST}${queryString}`);
  },
  
  async getFile(id: string) {
    return apiClient.get(API_ENDPOINTS.FILES.DETAIL(id));
  },
  
  async getFileContent(id: string) {
    return apiClient.get(API_ENDPOINTS.FILES.CONTENT(id));
  },
  
  async createFile(fileData: any) {
    return apiClient.post(API_ENDPOINTS.FILES.CREATE, fileData);
  },
  
  async updateFile(id: string, fileData: any) {
    return apiClient.put(API_ENDPOINTS.FILES.UPDATE(id), fileData);
  },
  
  async deleteFile(id: string) {
    return apiClient.delete(API_ENDPOINTS.FILES.DELETE(id));
  },
};

// Messages API functions
export const messagesApi = {
  async listMessages(params?: { page?: number; limit?: number; skillId?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiClient.get(`${API_ENDPOINTS.MESSAGES.LIST}${queryString}`);
  },
  
  async createMessage(messageData: any) {
    return apiClient.post(API_ENDPOINTS.MESSAGES.CREATE, messageData);
  },
  
  async updateMessage(id: string, messageData: any) {
    return apiClient.put(API_ENDPOINTS.MESSAGES.UPDATE(id), messageData);
  },
  
  async deleteMessage(id: string) {
    return apiClient.delete(API_ENDPOINTS.MESSAGES.DELETE(id));
  },
};

// General API functions
export const generalApi = {
  async getStats() {
    return apiClient.get(API_ENDPOINTS.STATS);
  },
  
  async checkHealth() {
    return apiClient.get(API_ENDPOINTS.HEALTH);
  },
  
  async syncWithNotion(data?: any) {
    return apiClient.post(API_ENDPOINTS.NOTION_SYNC, data);
  },
};

// Utility functions for API error handling
export function handleApiError(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isApiError(error: any): error is { response?: { data?: any } } {
  return error && typeof error === 'object' && 'response' in error;
}

// Export default API client
export default apiClient;