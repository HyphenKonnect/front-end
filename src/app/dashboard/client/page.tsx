import { Suspense } from "react";
import { ClientDashboard } from "../../../components/dashboard/ClientDashboard";
import { buildNoIndexMetadata } from "../../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Client Dashboard",
  "Secure client dashboard for The Hyphen Konnect bookings, messages, invoices, and session updates.",
  "/dashboard/client",
);

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ClientDashboard />
    </Suspense>
  );
}
