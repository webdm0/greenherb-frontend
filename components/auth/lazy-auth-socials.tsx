"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

function GoogleButtonFallback() {
  return (
    <Button
      type="button"
      variant="outline"
      disabled
      className="h-11 w-full justify-center rounded-full border-[#dadce0] bg-white text-[#3c4043] opacity-100 shadow-none hover:bg-white hover:text-[#3c4043]"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
      >
        <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.2Z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.4 13.7A6 6 0 0 1 6 11.9c0-.6.1-1.2.3-1.8V7.5H3.1A10 10 0 0 0 2 11.9c0 1.6.4 3.1 1.1 4.4l3.3-2.6Z" />
        <path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.9 9.9 0 0 0 12 2 10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.6 9.4 5.8 12 5.8Z" />
      </svg>
      Continue with Google
    </Button>
  )
}

const AuthSocialsContent = dynamic(
  () =>
    import("@/components/auth/auth-socials").then(
      (module) => module.AuthSocials,
    ),
  {
    ssr: false,
    loading: GoogleButtonFallback,
  },
)

export function LazyAuthSocials() {
  return <AuthSocialsContent />
}
