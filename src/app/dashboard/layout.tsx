import type { Metadata } from "next";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata: Metadata = buildNoIndexMetadata(
  "Dashboard",
  "Secure dashboard area for The Hyphen Konnect account access and role-based tools.",
  "/dashboard",
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
