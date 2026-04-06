import { InvoicePage } from "../../../../../components/dashboard/InvoicePage";

export default async function ClientInvoicePage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  return <InvoicePage paymentId={paymentId} />;
}
