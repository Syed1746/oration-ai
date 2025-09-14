// // src/pages/api/test-trpc.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/server/db";
// import { appRouter } from "@/server/routers/app";
// import { createTRPCContext } from "@/server/trpc";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const caller = appRouter.createCaller(await createTRPCContext({ req, res }));

//   // 1. Create session
//   const session = await caller.chat.createSession({ title: "Test Chat" });

//   // 2. Add message
//   await caller.chat.addMessage({
//     sessionId: session.id,
//     sender: "user",
//     content: "Hello from test API!",
//   });

//   // 3. Get messages
//   const messages = await caller.chat.getMessages({ sessionId: session.id });

//   res.status(200).json({ session, messages });
// }
