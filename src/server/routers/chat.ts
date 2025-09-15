import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db";
import axios from "axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatRouter = router({
  getSessions: publicProcedure.query(async () => {
    // 🔍 Debug log for DATABASE_URL
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

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
        const messages: ChatMessage[] = [
          {
            role: "assistant",
            content:
              "You are an AI career counselor. Provide thoughtful, practical career advice.",
          },
          ...input.context.map((msg): ChatMessage => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: input.message },
        ];

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          { model: "mistralai/mistral-7b-instruct", messages },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const reply: string | undefined =
          response.data.choices?.[0]?.message?.content;
        return reply ?? "Sorry, I cannot respond.";
      } catch (error: unknown) {
        console.error("OpenRouter error:", error);
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
