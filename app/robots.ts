import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/liked-collection"],
    },
    sitemap: "https://shagunratna.com/sitemap.xml",
  };
}
