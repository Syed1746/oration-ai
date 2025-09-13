// src/server/routers/chat.ts
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db";
import axios from "axios";

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
      try {
        const messages = [
          {
            role: "system",
            content:
              "You are an AI career counselor. Provide thoughtful, practical career advice.",
          },
          ...input.context,
          { role: "user", content: input.message },
        ];

        // Call OpenRouter API
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "mistralai/mistral-7b-instruct", // free and fast model
            messages,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const reply = response.data.choices[0]?.message?.content;
        console.log("AI reply:", reply);

        return reply ?? "Sorry, I cannot respond.";
      } catch (error: any) {
        console.error("OpenRouter error:", error.response?.data || error.message);
        return "Sorry, I failed to respond.";
      }
    }),

  addMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.number(),
        sender: z.enum(["user", "ai"]),
        content: z.string(),
      })
    )
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
