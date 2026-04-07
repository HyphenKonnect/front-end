"use client";

export type RazorpayOrderPayload = {
  bookingId: string;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
};

export type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  order: RazorpayOrderPayload;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (payload: RazorpaySuccessPayload) => void | Promise<void>;
  onFailure?: (message: string) => void;
  onDismiss?: () => void;
};

type RazorpayInstance = {
  open: () => void;
  on: (eventName: string, callback: (response: { error?: { description?: string } }) => void) => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existing) {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });

        window.setTimeout(() => {
          resolve(Boolean(window.Razorpay));
        }, 1500);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

export async function openRazorpayCheckout(options: RazorpayCheckoutOptions) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error("Razorpay checkout could not be loaded. Please try again.");
  }

  const razorpay = new window.Razorpay({
    key: options.order.key,
    amount: options.order.amount,
    currency: options.order.currency,
    name: options.name,
    description: options.description,
    order_id: options.order.orderId,
    prefill: options.prefill,
    handler: (response: RazorpaySuccessPayload) => {
      void options.onSuccess(response);
    },
    modal: {
      ondismiss: options.onDismiss,
    },
    theme: {
      color: "#f56969",
    },
  });

  razorpay.on("payment.failed", (response) => {
    options.onFailure?.(
      response.error?.description || "Payment failed before verification.",
    );
  });

  razorpay.open();
}
