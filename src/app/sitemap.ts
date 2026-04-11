import type { MetadataRoute } from "next";
import { professionals, serviceCatalog } from "../components/site/data";
import { buildAbsoluteUrl, publicStaticRoutes } from "../lib/seo";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = publicStaticRoutes.map((route) => ({
    url: buildAbsoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = serviceCatalog.map((service) => ({
    url: buildAbsoluteUrl(`/services/${service.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const professionalEntries: MetadataRoute.Sitemap = professionals.map(
    (professional) => ({
      url: buildAbsoluteUrl(`/professionals/${professional.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [...staticEntries, ...serviceEntries, ...professionalEntries];
}
