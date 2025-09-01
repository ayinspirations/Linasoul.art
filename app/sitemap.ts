// app/sitemap.ts
export default function sitemap() {
  const base = "https://linasoul.art"
  const now = new Date().toISOString()

  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
