import { AdminDashboard } from "../../../components/dashboard/AdminDashboard";
import { buildNoIndexMetadata } from "../../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Admin Dashboard",
  "Secure admin dashboard for The Hyphen Konnect operations, professionals, payments, and bookings.",
  "/dashboard/admin",
);

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
