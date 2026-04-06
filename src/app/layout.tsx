import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";
import { Footer } from "../components/site/Footer";
import { Navigation } from "../components/site/Navigation";
import { RouteScrollReset } from "../components/site/RouteScrollReset";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  title: "The Hyphen Konnect | Mental Wellness Platform",
  description:
    "India's first holistic mental wellness platform for narcissistic abuse/trauma survivors. Connect with therapists, doctors, and legal experts.",
  keywords: ["mental health", "therapy", "counseling", "wellness", "support"],
  authors: [{ name: "The Hyphen Konnect" }],

  robots: "index, follow",
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white text-[#2b2b2b]">
        <AuthProvider>
          <RouteScrollReset />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
