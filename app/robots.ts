import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const host = "https://linasoul.art" // <- DEIN KANONISCHER HOST
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}
