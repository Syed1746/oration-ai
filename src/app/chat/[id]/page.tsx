"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import ChatInput from "@/components/Chat/ChatInput";
import ChatWindow from "@/components/Chat/ChatWindow";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const sessionId = Number(params.id); // Get session id from URL
  const { data: messages, isLoading } = trpc.chat.getMessages.useQuery({
    sessionId,
  });

  if (isLoading) return <p>Loading messages...</p>;

  // Narrow types for ChatWindow
  const formattedMessages = (messages || []).map((msg) => ({
    id: msg.id,
    sender: msg.sender as "user" | "ai", // cast string to literal
    content: msg.content,
  }));

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat Session {sessionId}</h1>

      {/* Chat window */}
      <ChatWindow messages={formattedMessages} />

      {/* Input to send new message */}
      <ChatInput sessionId={sessionId} />
    </div>
  );
}
