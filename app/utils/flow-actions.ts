"use server"

import type { Flow } from "@/types/flow.types"

// Mock flows database
const mockFlows: Record<string, Flow> = {
  "1": {
    id: "1",
    name: "Sample Chat Flow",
    nodes: [
      {
        id: "start-1",
        type: "start",
        position: { x: 100, y: 200 },
        data: {
          message: "Welcome to our chat! How can I help you today?",
        },
      },
      {
        id: "message-1",
        type: "message",
        position: { x: 500, y: 200 },
        data: {
          message: "Thanks for reaching out! Let me gather some information.",
          delay: 1000,
        },
      },
      {
        id: "textinput-1",
        type: "textInput",
        position: { x: 900, y: 200 },
        data: {
          message: "What's your name?",
          placeholder: "Enter your full name",
          variableName: "user_name",
          required: true,
          minLength: 2,
          maxLength: 50,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "start-1",
        target: "message-1",
        type: "smoothstep",
      },
      {
        id: "e2-3",
        source: "message-1",
        target: "textinput-1",
        type: "smoothstep",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "2": {
    id: "2",
    name: "Customer Support Flow",
    nodes: [
      {
        id: "start-2",
        type: "start",
        position: { x: 100, y: 200 },
        data: {
          message: "Hi! I'm here to help with your support request.",
        },
      },
      {
        id: "textinput-2",
        type: "textInput",
        position: { x: 500, y: 200 },
        data: {
          message: "What issue are you experiencing?",
          placeholder: "Describe your issue...",
          variableName: "support_issue",
          required: true,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "start-2",
        target: "textinput-2",
        type: "smoothstep",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "3": {
    id: "3",
    name: "Lead Generation Flow",
    nodes: [
      {
        id: "start-3",
        type: "start",
        position: { x: 100, y: 200 },
        data: {
          message: "Let's get to know you better!",
        },
      },
      {
        id: "textinput-3",
        type: "textInput",
        position: { x: 500, y: 100 },
        data: {
          message: "What's your email address?",
          placeholder: "your@email.com",
          variableName: "email",
          required: true,
        },
      },
      {
        id: "textinput-4",
        type: "textInput",
        position: { x: 500, y: 300 },
        data: {
          message: "What's your company name?",
          placeholder: "Your company",
          variableName: "company",
          required: false,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "start-3",
        target: "textinput-3",
        type: "smoothstep",
      },
      {
        id: "e1-3",
        source: "start-3",
        target: "textinput-4",
        type: "smoothstep",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

export async function loadFlowWithContent(id: string) {
  try {
    // In a real app, this would fetch from your database
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate network delay

    const flow = mockFlows[id]
    if (!flow) {
      return {
        flow: null,
        error: "Flow not found",
      }
    }

    return {
      flow,
      error: null,
    }
  } catch (error) {
    return {
      flow: null,
      error: "Failed to load flow",
    }
  }
}
