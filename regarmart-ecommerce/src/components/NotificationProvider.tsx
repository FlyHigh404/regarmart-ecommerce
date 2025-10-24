"use client"

import { useSession } from "next-auth/react"
import useReplySocket from "@/hooks/useReplySocket"

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const userId = session?.user?.id as string

    useReplySocket(userId)

    return <>{children}</>
}