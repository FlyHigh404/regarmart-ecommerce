"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthCheck({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }

  interface Session {
    user?: SessionUser;
    [key: string]: any;
  }

  const { data: session, status } = useSession() as { data: Session | null, status: string };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) redirect("/auth/signin");
  if (role && session?.user?.role !== role) redirect("/unauthorized");

  return <>{children}</>;
}