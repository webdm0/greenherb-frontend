import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GreenHerb",
    short_name: "GreenHerb",
    description:
      "Premium herbal supplements with a calm, botanical storefront experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#1B3022",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/brandmark.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
  }
}
