"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  createdAt: string | Date;
}

interface ChatInputProps {
  sessionId: number;
  messages?: Message[]; // messages may be undefined initially
}

export default function ChatInput({
  sessionId,
  messages = [],
}: ChatInputProps) {
  const queryClient = trpc.useContext();

  // Mutation to add messages
  const addMessage = trpc.chat.addMessage.useMutation({
    onSuccess: () => queryClient.chat.getMessages.invalidate({ sessionId }),
  });

  // Mutation for AI response
  const aiResponse = trpc.chat.aiResponse.useMutation();

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Send user message and trigger AI response
  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = text;
    addMessage.mutate({ sessionId, sender: "user", content: userMessage });
    setText("");
    setIsTyping(true);

    try {
      // Send last 5 messages for context to AI
      const contextMessages: { role: "user" | "assistant"; content: string }[] =
        messages.slice(-5).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        }));

      // Get AI response
      const aiReply = await aiResponse.mutateAsync({
        message: userMessage,
        context: contextMessages,
      });

      // Add AI response to chat
      addMessage.mutate({ sessionId, sender: "ai", content: aiReply });
    } catch (err) {
      console.error("AI Error:", err);
      addMessage.mutate({
        sessionId,
        sender: "ai",
        content: "Sorry, I failed to respond.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Enter key to send, Shift+Enter to newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <textarea
          className="flex-1 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      {isTyping && (
        <div className="text-gray-500 italic text-sm mt-1 animate-pulse">
          AI is typing...
        </div>
      )}
    </div>
  );
}
