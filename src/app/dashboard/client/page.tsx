import { Suspense } from "react";
import { ClientDashboard } from "../../../components/dashboard/ClientDashboard";

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ClientDashboard />
    </Suspense>
  );
}
