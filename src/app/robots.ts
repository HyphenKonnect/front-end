import type { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/booking",
          "/consultation/",
          "/dashboard/",
          "/forgot-password",
          "/login",
          "/professional-login",
          "/register",
          "/reset-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
    host: buildAbsoluteUrl("/"),
  };
}
