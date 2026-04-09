import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "Mental Wellness", href: "/services/mental-wellness" },
  { label: "Medical Consultation", href: "/services/medical-consultation" },
  { label: "Legal Guidance", href: "/services/legal-guidance" },
  { label: "Wellness Programs", href: "/services/wellness-programs" },
];

const professionalLinks = [
  { label: "Therapists", href: "/professionals?category=therapist" },
  { label: "Medical Doctors", href: "/professionals?category=doctor" },
  { label: "Legal Advisors", href: "/professionals?category=legal" },
  { label: "Wellness Coaches", href: "/professionals?category=wellness" },
  { label: "Professional Login", href: "/professional-login" },
  { label: "Join as Professional", href: "/join-professional" },
];

const quickLinks = [
  { label: "Book a Session", href: "/booking" },
  { label: "Client Portal", href: "/dashboard/client" },
  { label: "Professional Login", href: "/professional-login" },
  { label: "Admin Portal", href: "/admin" },
  { label: "FAQ", href: "/resources" },
];

export function Footer() {
  const socialLinks = [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
  ];

  return (
    <footer
      id="contact"
      className="relative bg-[#2b2b2b] px-6 py-16 text-white lg:px-[120px]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center">
              <Image
                src="/brand-logo.png"
                alt="The Hyphen Konnect"
                width={174}
                height={112}
                className="h-auto w-[108px]"
              />
            </Link>
            <p className="text-sm leading-[22px] text-white/70">
              Your holistic wellness platform connecting you with expert
              professionals for mental, medical, and legal support.
            </p>
          </div>

          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Professionals" links={professionalLinks} />
          <FooterColumn title="Quick Links" links={quickLinks} />
        </div>

        <div className="my-8 border-t border-white/20" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <p className="text-sm text-white/60">
              Copyright {new Date().getFullYear()} The Hyphen Konnect. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-white/60 transition-colors hover:text-[#f56969]"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/terms"
                className="text-white/60 transition-colors hover:text-[#f56969]"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex gap-6 text-white/60">
            {socialLinks.map((link) => (
              <SocialIcon key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-base font-medium text-[#f86c6b]">{title}</h3>
      <ul className="space-y-3 text-sm text-white/80">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-colors hover:text-[#f56969]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="transition-colors hover:text-[#f56969]"
      aria-label={label}
    >
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        {label === "Facebook" ? (
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.2 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.57v1.88h2.8l-.45 2.9h-2.35V22c4.78-.73 8.44-4.91 8.44-9.93Z" />
        ) : label === "Instagram" ? (
          <path d="M12 7.2c-2.65 0-4.8 2.15-4.8 4.8s2.15 4.8 4.8 4.8 4.8-2.15 4.8-4.8-2.15-4.8-4.8-4.8Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-7.98a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Zm3.2 1.13c-.07-1.46-.4-2.76-1.47-3.83S17.46 2.1 16 2.03c-1.5-.09-6.01-.09-7.51 0-1.46.07-2.76.4-3.83 1.47S2.1 6.05 2.03 7.5c-.09 1.5-.09 6.01 0 7.51.07 1.46.4 2.76 1.47 3.83s2.37 1.4 3.83 1.47c1.5.09 6.01.09 7.51 0 1.46-.07 2.76-.4 3.83-1.47s1.4-2.37 1.47-3.83c.09-1.5.09-6.01 0-7.51ZM19.3 18.6a3.86 3.86 0 0 1-2.17 2.17c-1.5.6-5.05.46-5.13.46s-3.63.13-5.13-.46a3.86 3.86 0 0 1-2.17-2.17c-.6-1.5-.46-5.05-.46-5.13s-.13-3.63.46-5.13A3.86 3.86 0 0 1 6.87 4.2c1.5-.6 5.05-.46 5.13-.46s3.63-.13 5.13.46a3.86 3.86 0 0 1 2.17 2.17c.6 1.5.46 5.05.46 5.13s.13 3.63-.46 5.13Z" />
        ) : label === "LinkedIn" ? (
          <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.65H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm-1.78 13.02h3.55V9H3.56v11.45ZM22 2H2v20h20V2Z" />
        ) : (
          <path d="M19.6 7.2c-.2-.77-.8-1.38-1.57-1.58C16.64 5.2 12 5.2 12 5.2s-4.64 0-6.03.42c-.77.2-1.37.81-1.57 1.58C4 8.6 4 12 4 12s0 3.4.4 4.8c.2.77.8 1.38 1.57 1.58 1.39.42 6.03.42 6.03.42s4.64 0 6.03-.42c.77-.2 1.37-.81 1.57-1.58.4-1.4.4-4.8.4-4.8s0-3.4-.4-4.8Zm-9.1 7.27V9.53l4.16 2.47-4.16 2.47Z" />
        )}
      </svg>
    </a>
  );
}
