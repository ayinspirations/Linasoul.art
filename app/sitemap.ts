import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://linasoul.art" // <- DEIN KANONISCHER HOST
  const lastMod = new Date()

  return [
    { url: `${base}/`,          lastModified: lastMod, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/datenschutz`, lastModified: lastMod, changeFrequency: "yearly",  priority: 0.2 },
  ]
}
