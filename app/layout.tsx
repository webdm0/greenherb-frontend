import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { CartProvider } from "@/hooks/useCart"
import { getSiteUrl } from "@/lib/site-url"
import { fontVariables } from "./fonts"
import "./globals.css"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GreenHerb | Herbal Supplements, Teas, and Everyday Wellness",
  description: "Shop herbal supplements, teas, vitamins, and everyday support products for sleep, digestion, energy, immunity, and more.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brandmark.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              {children}
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
