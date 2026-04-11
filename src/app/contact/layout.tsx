import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us for Bookings, Support and Care Guidance",
  description:
    "Contact The Hyphen Konnect for booking help, service guidance, WhatsApp support, or general questions about therapy, medical, legal, and wellness care.",
  path: "/contact",
  keywords: [
    "contact The Hyphen Konnect",
    "booking support",
    "therapy support contact",
    "medical consultation contact",
    "legal guidance contact",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
