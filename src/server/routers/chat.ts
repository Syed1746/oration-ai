// src/server/routers/chat.ts
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db";

export const chatRouter = router({
  getSessions: publicProcedure.query(async () => {
    return prisma.chatSession.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  createSession: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.chatSession.create({ data: { title: input.title } });
    }),
  getMessages: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      return prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });
    }),
    aiResponse: publicProcedure
    .input(
      z.object({
        message: z.string(),
        context: z.array(
          z.object({ role: z.enum(["user", "assistant"]), content: z.string() })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // For now, just return a fake AI response
      return `AI Response to: "${input.message}"`;
    }),
  addMessage: publicProcedure
    .input(z.object({
      sessionId: z.number(),
      sender: z.enum(["user", "ai"]),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return prisma.message.create({
        data: {
          sessionId: input.sessionId,
          sender: input.sender,
          content: input.content,
        },
      });
    }),
});
