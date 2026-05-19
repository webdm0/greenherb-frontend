"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form-message"

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

export function GoogleSignInButton() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const buttonHostRef = useRef<HTMLDivElement | null>(null)
  const initializedRef = useRef(false)
  const loginWithGoogleRef = useRef(loginWithGoogle)

  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle
  }, [loginWithGoogle])

  useEffect(() => {
    if (!googleClientId || typeof window === "undefined") {
      return
    }

    let cancelled = false

    const initializeButton = () => {
      if (cancelled || initializedRef.current || !window.google) {
        return false
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            setError("Google sign-in couldn't be completed. Please try again.")
            return
          }

          try {
            setError(null)
            setIsSubmitting(true)
            await loginWithGoogleRef.current(response.credential)
            router.push("/")
            router.refresh()
            return
          } catch (loginError) {
            setError(
              loginError instanceof Error
                ? loginError.message
                : "Google sign-in didn't work. Please try again.",
            )
            setIsSubmitting(false)
          }
        },
      })

      const buttonRoot = buttonHostRef.current
      const buttonWidth = Math.floor(buttonRoot?.getBoundingClientRect().width ?? 0)
      if (!buttonRoot || buttonWidth <= 0) {
        return false
      }

      initializedRef.current = true
      buttonRoot.innerHTML = ""
      window.google.accounts.id.renderButton(buttonRoot, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "pill",
        text: "continue_with",
        locale: "en",
        width: buttonWidth,
      })
      setIsReady(true)
      return true
    }

    if (initializeButton()) {
      return () => {
        cancelled = true
      }
    }

    const intervalId = window.setInterval(() => {
      if (initializeButton()) {
        window.clearInterval(intervalId)
      }
    }, 150)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [router])

  if (!googleClientId) {
    return (
      <FormMessage className="border-border bg-muted/40 px-3 py-2">
        Google sign-in is unavailable right now.
      </FormMessage>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="relative min-h-11">
        <div
          ref={buttonHostRef}
          className={`h-11 w-full overflow-hidden rounded-full${isSubmitting ? " pointer-events-none invisible" : ""}`}
        />
        {!isReady || isSubmitting ? (
          <div className="absolute inset-0">
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-11 w-full justify-center rounded-full border-[#dadce0] bg-white text-[#3c4043] opacity-100 shadow-none hover:bg-white hover:text-[#3c4043]"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin" stroke={2} />
                  Signing in with Google...
                </>
              ) : (
                <>
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
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
      {error ? (
        <FormMessage variant="error">
          {error}
        </FormMessage>
      ) : null}
    </div>
  )
}
