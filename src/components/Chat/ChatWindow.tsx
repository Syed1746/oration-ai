"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  createdAt: string | Date;
}

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const formatTime = (dateValue: string | Date) => {
    if (!dateValue) return "";
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 rounded shadow-inner"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-start gap-2 max-w-xl ${
            msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
          }`}
        >
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
            bg-blue-500"
          >
            {msg.sender === "user" ? "U" : "AI"}
          </div>

          {/* Message Bubble */}
          <div
            className={`p-3 rounded-xl flex flex-col shadow ${
              msg.sender === "user"
                ? "bg-blue-200 text-gray-800 animate-slideRight"
                : "bg-gray-200 text-gray-900 animate-slideLeft"
            }`}
          >
            <span>{msg.content}</span>
            <span className="text-xs text-gray-500 self-end mt-1">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
