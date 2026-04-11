import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";
import { Footer } from "../components/site/Footer";
import { Navigation } from "../components/site/Navigation";
import { RouteScrollReset } from "../components/site/RouteScrollReset";
import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  defaultKeywords,
} from "../lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Online Mental Wellness, Medical, Legal & Wellness Support | The Hyphen Konnect",
    template: "%s | The Hyphen Konnect",
  },
  description:
    "The Hyphen Konnect connects people in India with online therapists, doctors, legal advisors, and wellness experts for trusted holistic support.",
  keywords: defaultKeywords,
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand-logo.png",
    shortcut: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
  openGraph: {
    title:
      "Online Mental Wellness, Medical, Legal & Wellness Support | The Hyphen Konnect",
    description:
      "The Hyphen Konnect connects people in India with online therapists, doctors, legal advisors, and wellness experts for trusted holistic support.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title:
      "Online Mental Wellness, Medical, Legal & Wellness Support | The Hyphen Konnect",
    description:
      "The Hyphen Konnect connects people in India with online therapists, doctors, legal advisors, and wellness experts for trusted holistic support.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        ["--font-sans" as string]:
          "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#F56969" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="antialiased bg-white text-[#2b2b2b]">
        <AuthProvider>
          <Suspense fallback={null}>
            <RouteScrollReset />
          </Suspense>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
