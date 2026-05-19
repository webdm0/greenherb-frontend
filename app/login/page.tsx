import { AuthShell } from "@/components/auth/auth-shell"
import { LazyAuthSocials } from "@/components/auth/lazy-auth-socials"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="flex-1">
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to your account"
        description="Sign in to check your orders, move through checkout faster, and keep your purchases in one place."
        heroTitle="Sign in to keep shopping."
        heroDescription="Check your orders, move through checkout faster, and keep your purchases in one place."
        switchLabel="New to GreenHerb?"
        switchHref="/register"
        switchText="Create an account"
        socialActions={<LazyAuthSocials />}
      >
        <LoginForm />
      </AuthShell>
    </main>
  )
}
