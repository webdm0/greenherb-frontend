import localFont from "next/font/local"

export const fraunces = localFont({
  src: [
    {
      path: "./fonts/fraunces-v38-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/fraunces-v38-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/fraunces-v38-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
})

export const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope-v20-cyrillic_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/manrope-v20-cyrillic_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/manrope-v20-cyrillic_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/manrope-v20-cyrillic_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})

export const fontVariables = `${fraunces.variable} ${manrope.variable}`
