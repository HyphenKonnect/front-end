import { ProfessionalDashboard } from "../../../components/dashboard/ProfessionalDashboard";
import { buildNoIndexMetadata } from "../../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Professional Dashboard",
  "Secure professional dashboard for The Hyphen Konnect practitioners, availability, clients, and payouts.",
  "/dashboard/professional",
);

export default function ProfessionalDashboardPage() {
  return <ProfessionalDashboard />;
}
