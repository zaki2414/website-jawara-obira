import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

// Next membangkitkan /robots.txt dari file ini (konvensi App Router).
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin dan /login tidak punya nilai untuk mesin pencari, dan /api
      // bukan halaman. Ini BUKAN lapisan keamanan — gerbang sesungguhnya ada
      // di proxy.ts + getAdminUser(); ini cuma supaya crawler tidak membuang
      // kuotanya (dan tidak mengindeks halaman login).
      disallow: ["/admin", "/login", "/api/", "/auth/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
