"use client"

import Script from "next/script"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

export function AuthSocials() {
  return (
    <div className="grid gap-3">
      <Script src="https://accounts.google.com/gsi/client?hl=en" strategy="afterInteractive" />
      <GoogleSignInButton />
    </div>
  )
}
