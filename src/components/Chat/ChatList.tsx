"use client";

import { trpc } from "@/utils/trpc";
import Link from "next/link";

export default function HomePage() {
  const { data: sessions, isLoading } = trpc.chat.getSessions.useQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Chat Sessions</h1>

      {sessions?.map((session: any) => (
        <div key={session.id}>
          <Link href={`/chat/${session.id}`}>{session.title}</Link>
        </div>
      ))}
    </div>
  );
}
