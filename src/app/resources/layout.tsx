import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Resources, FAQs and Support Guides",
  description:
    "Explore The Hyphen Konnect support resources, FAQs, mental wellness guides, legal handbooks, and practical wellness content.",
  path: "/resources",
  keywords: [
    "mental wellness resources",
    "support guides",
    "therapy FAQs",
    "legal rights handbook",
    "wellness education",
  ],
});

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
