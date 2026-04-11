import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata: Metadata = buildNoIndexMetadata(
  "Book an Online Session",
  "Secure booking flow for online therapy, medical consultation, legal guidance, and wellness sessions on The Hyphen Konnect.",
  "/booking",
);

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
