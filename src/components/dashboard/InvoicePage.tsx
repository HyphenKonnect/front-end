"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { getServiceLabel } from "../../lib/booking-helpers";
import { formatDateTime, formatInr } from "../../lib/formatting";
import { StatusBanner } from "../ui/StatusBanner";
import { DashboardShell } from "./dashboard-primitives";

type InvoiceRecord = {
  _id: string;
  amount: number;
  basePrice?: number;
  gstAmount?: number;
  currency?: string;
  status: string;
  invoiceNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  method?: string;
  timestamps?: {
    createdAt?: string;
    capturedAt?: string;
  };
  bookingId?: {
    serviceId?: string;
    scheduledAt?: string;
    status?: string;
  };
  professionalId?: {
    name?: string;
    email?: string;
    profile?: {
      specialisation?: string;
    };
  };
  clientId?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export function InvoicePage({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadInvoice = async () => {
      try {
        if (!ignore) setLoading(true);
        const response = await apiFetch(`/api/payments/invoice/${paymentId}`);
        const data = await parseJsonResponse<InvoiceRecord>(response);
        if (!ignore) {
          setInvoice(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load this invoice right now.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadInvoice();

    return () => {
      ignore = true;
    };
  }, [paymentId]);

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardShell
        accent="Invoice"
        title={invoice?.invoiceNumber || "Your receipt"}
        description="Review payment details, session information, and a print-friendly invoice for your records."
        actions={
          <>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-5 py-2.5 text-sm font-medium text-white"
            >
              <Download className="h-4 w-4" />
              Download / Print
            </button>
          </>
        }
      >
        {error ? (
          <StatusBanner tone="error" title="Invoice unavailable">
            {error}
          </StatusBanner>
        ) : null}

        {!error && loading ? (
          <div className="rounded-[28px] bg-white p-7 shadow-sm">
            <p className="text-sm text-[#7e7e7e]">Loading invoice details...</p>
          </div>
        ) : null}

        {!loading && invoice ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-[28px] bg-white p-7 shadow-sm lg:col-span-8">
              <div className="flex flex-col gap-5 border-b border-[#eee6e3] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f56969]">
                    The Hyphen Konnect
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-[#2b2b2b]">
                    Invoice {invoice.invoiceNumber || invoice._id}
                  </h2>
                  <p className="mt-2 text-sm text-[#7e7e7e]">
                    Generated on{" "}
                    {formatDateTime(
                      invoice.timestamps?.capturedAt ||
                        invoice.timestamps?.createdAt ||
                        new Date().toISOString(),
                    )}
                  </p>
                </div>
                <div className="rounded-[22px] bg-[#f7f5f4] px-5 py-4 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                    Total paid
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#2b2b2b]">
                    {formatInr(invoice.amount || 0)}
                  </p>
                  <p className="mt-1 text-sm capitalize text-[#7e7e7e]">
                    {invoice.status} via {invoice.method || "online payment"}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 py-6 md:grid-cols-2">
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                    Billed to
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#2b2b2b]">
                    {invoice.clientId?.name || "Client"}
                  </p>
                  <p className="mt-2 text-sm text-[#7e7e7e]">{invoice.clientId?.email}</p>
                  {invoice.clientId?.phone ? (
                    <p className="mt-1 text-sm text-[#7e7e7e]">{invoice.clientId.phone}</p>
                  ) : null}
                </div>
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                    Professional
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#2b2b2b]">
                    {invoice.professionalId?.name || "Assigned professional"}
                  </p>
                  <p className="mt-2 text-sm text-[#7e7e7e]">
                    {invoice.professionalId?.profile?.specialisation || "Support session"}
                  </p>
                  {invoice.professionalId?.email ? (
                    <p className="mt-1 text-sm text-[#7e7e7e]">
                      {invoice.professionalId.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#eee6e3]">
                <div className="grid grid-cols-[1.6fr_0.9fr_0.9fr] bg-[#f7f5f4] px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                  <span>Description</span>
                  <span>Session</span>
                  <span className="text-right">Amount</span>
                </div>
                <div className="grid grid-cols-[1.6fr_0.9fr_0.9fr] items-start border-t border-[#eee6e3] px-5 py-5 text-sm text-[#2b2b2b]">
                  <div>
                    <p className="font-semibold">
                      {getServiceLabel(invoice.bookingId?.serviceId)}
                    </p>
                    <p className="mt-2 text-[#7e7e7e]">
                      {invoice.bookingId?.scheduledAt
                        ? formatDateTime(invoice.bookingId.scheduledAt)
                        : "Scheduled session"}
                    </p>
                  </div>
                  <div>
                    <p>1 x consultation</p>
                  </div>
                  <div className="text-right font-semibold">
                    {formatInr(invoice.basePrice || 0)}
                  </div>
                </div>
                <div className="space-y-3 border-t border-[#eee6e3] px-5 py-5 text-sm">
                  <div className="flex items-center justify-between text-[#7e7e7e]">
                    <span>Session fee subtotal</span>
                    <span>{formatInr(invoice.basePrice || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#7e7e7e]">
                    <span>GST (18%)</span>
                    <span>{formatInr(invoice.gstAmount || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eee6e3] pt-3 text-base font-semibold text-[#2b2b2b]">
                    <span>Total paid</span>
                    <span>{formatInr(invoice.amount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-7 shadow-sm lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f56969]">
                Payment references
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-sm text-[#7e7e7e]">Invoice number</p>
                  <p className="mt-2 break-all font-semibold text-[#2b2b2b]">
                    {invoice.invoiceNumber || "Pending assignment"}
                  </p>
                </div>
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-sm text-[#7e7e7e]">Razorpay order ID</p>
                  <p className="mt-2 break-all font-semibold text-[#2b2b2b]">
                    {invoice.razorpayOrderId || "Not available"}
                  </p>
                </div>
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-sm text-[#7e7e7e]">Razorpay payment ID</p>
                  <p className="mt-2 break-all font-semibold text-[#2b2b2b]">
                    {invoice.razorpayPaymentId || "Not available"}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/client"
                className="mt-6 inline-flex rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
              >
                Back to client dashboard
              </Link>
            </div>
          </div>
        ) : null}
      </DashboardShell>
    </ProtectedRoute>
  );
}
