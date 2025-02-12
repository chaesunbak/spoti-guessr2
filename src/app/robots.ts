import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://spoti-guessr.vercel.app/sitemap.xml", // 사이트맵 URL
  };
}
