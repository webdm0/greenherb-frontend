"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconLock, IconMail, IconUser } from "@tabler/icons-react"
import { AuthField, PasswordField } from "@/components/auth/auth-form-fields"
import { useAuth } from "@/components/auth/auth-provider"
import { ProjectDisclaimerModal } from "@/components/legal/project-disclaimer-modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormMessage } from "@/components/ui/form-message"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!acceptedTerms) {
      setError("Please accept the terms and privacy policy.")
      return
    }

    if (password.length < 8) {
      setError("Please use at least 8 characters for your password.")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      router.push("/")
      router.refresh()
      return
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't create your account right now.",
      )
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AuthField
        icon={<IconUser className="h-4 w-4" stroke={1.9} />}
        label="Username"
        hint="Use English letters, numbers, underscores, or hyphens."
        type="text"
        autoComplete="username"
        placeholder="jane_cooper"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        disabled={isSubmitting}
        minLength={3}
        maxLength={40}
        required
      />

      <AuthField
        icon={<IconMail className="h-4 w-4" stroke={1.9} />}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSubmitting}
        maxLength={255}
        required
      />

      <PasswordField
        icon={<IconLock className="h-4 w-4" stroke={1.9} />}
        label="Password"
        hint="Use at least 8 characters."
        isVisible={showPassword}
        onToggleVisibility={() => setShowPassword((current) => !current)}
        autoComplete="new-password"
        placeholder="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        minLength={8}
        maxLength={128}
        required
      />

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Checkbox
          aria-label="Accept terms and privacy policy"
          className="mt-0.5"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          disabled={isSubmitting}
        />
        <span>
          I agree to the{" "}
          <ProjectDisclaimerModal
            triggerLabel="terms"
            triggerClassName="font-semibold text-foreground inline-muted-link cursor-pointer"
          />{" "}
          and{" "}
          <ProjectDisclaimerModal
            triggerLabel="privacy policy"
            triggerClassName="font-semibold text-foreground inline-muted-link cursor-pointer"
          />
          .
        </span>
      </div>

      {error ? (
        <FormMessage variant="error">
          {error}
        </FormMessage>
      ) : null}

      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
