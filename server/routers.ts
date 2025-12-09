import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createApiKey, getUserApiKeys, revokeApiKey, getPricingPlans } from "./db";
import { developerRouter } from "./routers/developer";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  pricing: router({
    list: publicProcedure.query(async () => {
      const plans = await getPricingPlans();
      return plans.map(plan => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
      }));
    }),
  }),

  apiKeys: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const keys = await getUserApiKeys(ctx.user.id);
      return keys.map(key => ({
        ...key,
        key: key.key.substring(0, 8) + '...' // Mask the key
      }));
    }),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const newKey = 'sk_' + Math.random().toString(36).substring(2, 15);
        await createApiKey(ctx.user.id, input.name, newKey);
        return { key: newKey, name: input.name };
      }),
    revoke: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .mutation(async ({ input }) => {
        await revokeApiKey(input.keyId);
        return { success: true };
      }),
  }),

  developer: developerRouter,

  oauth: router({
    github: publicProcedure
      .input(z.object({ code: z.string().optional() }))
      .mutation(async ({ input }) => {
        // Mock OAuth flow for GitHub
        return {
          success: true,
          message: 'GitHub OAuth flow initiated',
          code: input.code || 'mock_github_code',
        };
      }),
    google: publicProcedure
      .input(z.object({ code: z.string().optional() }))
      .mutation(async ({ input }) => {
        // Mock OAuth flow for Google
        return {
          success: true,
          message: 'Google OAuth flow initiated',
          code: input.code || 'mock_google_code',
        };
      }),
    email: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        // Mock OAuth flow for Email
        return {
          success: true,
          message: 'Email verification link sent',
          email: input.email,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
