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
  { label: "Admin Portal", href: "/dashboard/admin" },
  { label: "FAQ", href: "/resources" },
];

export function Footer() {
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
    <a
      href="#"
      className="transition-colors hover:text-[#f56969]"
      aria-label="Social link"
    >
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </a>
  );
}
