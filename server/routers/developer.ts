import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import crypto from "crypto";

// Mock API Keys storage (in production, use database)
const apiKeys: Record<string, any> = {};

function generateApiKey(): string {
  return `sk_${crypto.randomBytes(24).toString("hex")}`;
}

function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export const developerRouter = router({
  // Get all API keys for current user
  listApiKeys: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      return [];
    }

    // Return mock API keys (in production, fetch from database)
    return Object.values(apiKeys)
      .filter((key) => key.userId === userId)
      .map((key) => ({
        id: key.id,
        name: key.name,
        description: key.description,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        isRevoked: !!key.revokedAt,
      }));
  }),

  // Create a new API key
  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const apiKey = generateApiKey();
      const keyHash = hashApiKey(apiKey);
      const id = crypto.randomUUID();

      // Store in mock storage (in production, save to database)
      apiKeys[id] = {
        id,
        userId,
        keyHash,
        name: input.name,
        description: input.description || null,
        createdAt: new Date(),
        lastUsedAt: null,
        revokedAt: null,
      };

      return {
        id,
        apiKey, // Only show full key once
        name: input.name,
        description: input.description,
        createdAt: new Date(),
      };
    }),

  // Revoke an API key
  revokeApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const key = apiKeys[input.id];
      if (!key || key.userId !== userId) {
        throw new Error("API key not found");
      }

      key.revokedAt = new Date();

      return { success: true };
    }),

  // Delete an API key
  deleteApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const key = apiKeys[input.id];
      if (!key || key.userId !== userId) {
        throw new Error("API key not found");
      }

      delete apiKeys[input.id];

      return { success: true };
    }),

  // Get API usage for a key
  getApiUsage: protectedProcedure
    .input(z.object({ id: z.string(), days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const key = apiKeys[input.id];
      if (!key || key.userId !== userId) {
        throw new Error("API key not found");
      }

      // Return mock usage data
      return {
        id: input.id,
        name: key.name,
        totalRequests: Math.floor(Math.random() * 10000),
        successfulRequests: Math.floor(Math.random() * 9500),
        failedRequests: Math.floor(Math.random() * 500),
        averageResponseTime: Math.floor(Math.random() * 500) + 50,
        lastUsedAt: key.lastUsedAt,
      };
    }),
});
