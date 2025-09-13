// src/server/routers/_app.ts
import { router } from "../trpc";
import { chatRouter } from "./chat";

export const appRouter = router({
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
