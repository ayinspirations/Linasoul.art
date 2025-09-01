// app/sitemap.ts
export default function sitemap() {
  const base = "https://linasoul.art"
  const now = new Date().toISOString()

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/galerie`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kuenstler`, lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/kontakt`,   lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
