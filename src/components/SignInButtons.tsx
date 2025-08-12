"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignInButtons() {
  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <FcGoogle className="h-5 w-5" />
        Masuk dengan Google
      </button>
    </div>
  );
}