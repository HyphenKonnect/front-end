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
  { label: "Join as Professional", href: "/contact" },
];

const quickLinks = [
  { label: "Book a Session", href: "/booking" },
  { label: "Client Portal", href: "/resources" },
  { label: "Professional Portal", href: "/professionals" },
  { label: "FAQ", href: "/resources" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative bg-[#2b2b2b] px-6 py-16 text-white lg:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white ring-1 ring-white/15">
                H
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f86c6b]">
                  The Hyphen
                </p>
                <p className="text-lg font-bold text-white">Konnect</p>
              </div>
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
              © {new Date().getFullYear()} The Hyphen Konnect. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-white/60 transition-colors hover:text-[#f56969]"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link
                href="/terms"
                className="text-white/60 transition-colors hover:text-[#f56969]"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex gap-6 text-white/60">
            <SocialIcon />
            <SocialIcon />
            <SocialIcon />
            <SocialIcon />
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

function SocialIcon() {
  return (
    <a href="#" className="transition-colors hover:text-[#f56969]" aria-label="Social link">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </a>
  );
}
