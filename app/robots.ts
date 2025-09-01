// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://linasoul.art/sitemap.xml",
    host: "https://linasoul.art",
  }
}
