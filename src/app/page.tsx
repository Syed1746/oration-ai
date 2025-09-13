"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { data: sessions, isLoading } = trpc.chat.getSessions.useQuery();
  const queryClient = trpc.useContext();
  const createSession = trpc.chat.createSession.useMutation({
    onSuccess: () => queryClient.chat.getSessions.invalidate(),
  });

  const [newTitle, setNewTitle] = useState("");

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createSession.mutate({ title: newTitle.trim() });
    setNewTitle("");
  };

  if (isLoading)
    return (
      <p className="text-gray-500 text-center mt-10 text-lg">
        Loading sessions...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        💬 Your Chat Sessions
      </h1>

      {/* New Session Input */}
      <div className="flex gap-3 mb-8">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter new chat title..."
        />
        <button
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sessions?.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Link
                href={`/chat/${session.id}`}
                className="flex justify-between items-center p-5 rounded-xl bg-white shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <span className="font-medium text-gray-800 text-lg">
                  {session.title}
                </span>
                <span className="text-gray-400 text-sm">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {!sessions?.length && (
          <p className="text-gray-500 text-center mt-6 text-lg">
            No sessions yet. Start a new chat! ✨
          </p>
        )}
      </div>
    </div>
  );
}
