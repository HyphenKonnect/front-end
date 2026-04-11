import Link from "next/link";
import { professionals, serviceCatalog } from "../../components/site/data";
import { PageHero, SurfaceCard } from "../../components/site/page-primitives";
import { buildPageMetadata, publicStaticRoutes } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "HTML Sitemap",
  description:
    "Browse all important public pages, service pages, and professional profile pages on The Hyphen Konnect.",
  path: "/sitemap.html",
  keywords: [
    "html sitemap",
    "website pages",
    "browse all pages",
    "public site structure",
  ],
});

export default function SitemapHtmlPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Website Sitemap"
        title="Browse Every"
        highlight="Public Page"
        description="A human-readable sitemap to help visitors and search engines discover the main areas of The Hyphen Konnect."
      />

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-3">
          <SitemapSection
            title="Core Pages"
            items={publicStaticRoutes.map((route) => ({
              href: route.path,
              label: route.label,
              description: route.description,
            }))}
          />
          <SitemapSection
            title="Service Pages"
            items={serviceCatalog.map((service) => ({
              href: `/services/${service.slug}`,
              label: service.title,
              description: service.description,
            }))}
          />
          <SitemapSection
            title="Professional Profiles"
            items={professionals.map((professional) => ({
              href: `/professionals/${professional.slug}`,
              label: professional.name,
              description: `${professional.specialty} • ${professional.location}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}

function SitemapSection({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; description: string }[];
}) {
  return (
    <SurfaceCard className="h-full bg-[#f7f5f4]">
      <h2 className="mb-6 text-[28px] font-bold text-[#2b2b2b]">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-[20px] bg-white p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-[16px] font-semibold text-[#2b2b2b]">
              {item.label}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#7e7e7e]">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </SurfaceCard>
  );
}
