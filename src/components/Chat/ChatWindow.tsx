"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaUser, FaRobot } from "react-icons/fa";

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
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const formatTime = (dateValue: string | Date) => {
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      ref={containerRef}
      className="h-[70vh] overflow-y-auto p-6 flex flex-col gap-4 
                 relative rounded-2xl shadow-xl border border-gray-200"
      style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`,
        backgroundColor: "rgba(245, 246, 252, 0.9)",
        backgroundBlendMode: "overlay",
      }}
    >
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-end gap-3 max-w-[80%] ${
            msg.sender === "user"
              ? "self-end flex-row-reverse"
              : "self-start flex-row"
          }`}
        >
          {/* Avatar with Icons */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg
            ${
              msg.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
          >
            {msg.sender === "user" ? (
              <FaUser size={18} />
            ) : (
              <FaRobot size={18} />
            )}
          </div>

          {/* Chat Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl text-sm shadow-md backdrop-blur-md bg-opacity-80 relative
            ${
              msg.sender === "user"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}
          >
            <p className="whitespace-pre-line">{msg.content}</p>
            <span
              className={`text-xs mt-1 block ${
                msg.sender === "user" ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {formatTime(msg.createdAt)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
