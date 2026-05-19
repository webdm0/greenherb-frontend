"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconLock, IconMail } from "@tabler/icons-react"
import { AuthField, PasswordField } from "@/components/auth/auth-form-fields"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form-message"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({
        identifier: identifier.trim(),
        password,
      })

      router.push("/")
      router.refresh()
      return
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't sign you in right now.",
      )
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AuthField
        icon={<IconMail className="h-4 w-4" stroke={1.9} />}
        label="Email or username"
        type="text"
        autoComplete="username"
        placeholder="you@example.com"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        disabled={isSubmitting}
        minLength={3}
        maxLength={255}
        required
      />

      <PasswordField
        icon={<IconLock className="h-4 w-4" stroke={1.9} />}
        label="Password"
        isVisible={showPassword}
        onToggleVisibility={() => setShowPassword((current) => !current)}
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        maxLength={128}
        required
      />

      {error ? (
        <FormMessage variant="error">
          {error}
        </FormMessage>
      ) : null}

      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
