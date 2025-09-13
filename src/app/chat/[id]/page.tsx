// app/chat/[id]/page.tsx
"use client";

import { use } from "react"; // ✅ new React hook
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import ChatWindow from "@/components/Chat/ChatWindow";
import ChatInput from "@/components/Chat/ChatInput";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ unwrap the promise
  const sessionId = Number(id);

  const { data: messagesData } = trpc.chat.getMessages.useQuery({ sessionId });
  const [messages, setMessages] = useState(messagesData || []);

  useEffect(() => {
    if (messagesData) setMessages(messagesData);
  }, [messagesData]);

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <ChatWindow
        messages={messages.map((m) => ({
          ...m,
          sender: m.sender as "user" | "ai", // ✅ cast to union
        }))}
      />
      <ChatInput
        sessionId={sessionId}
        messages={messages.map((m) => ({
          ...m,
          sender: m.sender as "user" | "ai",
        }))}
      />
    </div>
  );
}
