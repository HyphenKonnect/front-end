"use client";

type DailyCallFrame = {
  join: (options: { url: string; token?: string }) => Promise<void>;
  destroy: () => void;
};

type DailyNamespace = {
  createFrame: (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => DailyCallFrame;
};

declare global {
  interface Window {
    DailyIframe?: DailyNamespace;
  }
}

let dailyScriptPromise: Promise<boolean> | null = null;

export function loadDailyPrebuilt() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.DailyIframe) {
    return Promise.resolve(true);
  }

  if (!dailyScriptPromise) {
    dailyScriptPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://unpkg.com/@daily-co/daily-js"]',
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/@daily-co/daily-js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return dailyScriptPromise;
}

export async function createDailyFrame(
  container: HTMLElement,
  options: { url: string; token?: string },
) {
  const isLoaded = await loadDailyPrebuilt();
  if (!isLoaded || !window.DailyIframe) {
    throw new Error("The Daily video client could not be loaded.");
  }

  const frame = window.DailyIframe.createFrame(container, {
    showLeaveButton: true,
    iframeStyle: {
      width: "100%",
      height: "100%",
      border: "0",
      borderRadius: "28px",
    },
  });

  await frame.join({
    url: options.url,
    token: options.token,
  });

  return frame;
}
