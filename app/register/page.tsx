import { AuthShell } from "@/components/auth/auth-shell"
import { LazyAuthSocials } from "@/components/auth/lazy-auth-socials"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <main className="flex-1">
      <AuthShell
        eyebrow="New customer"
        title="Create your account"
        description="Create an account to place orders, save your details for checkout, and view your order history anytime."
        heroTitle="Create an account for a smoother checkout flow."
        heroDescription="Save your details, come back to your cart faster, and keep your orders in one place."
        switchLabel="Already have an account?"
        switchHref="/login"
        switchText="Sign in"
        socialActions={<LazyAuthSocials />}
      >
        <RegisterForm />
      </AuthShell>
    </main>
  )
}
