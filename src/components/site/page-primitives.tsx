import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
}) {
  return (
    <section className="relative bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 py-16 lg:px-[120px] lg:py-24">
      <div className="mx-auto max-w-[1440px] text-center">
        <p className="mb-4 text-[16px] text-[#7e7e7e]">{eyebrow}</p>
        <h1 className="mb-6 text-[48px] font-bold leading-tight tracking-[-1.8px] text-[#2b2b2b] lg:text-[56px]">
          {title}{" "}
          {highlight ? (
            <span className="bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] bg-clip-text text-transparent">
              {highlight}
            </span>
          ) : null}
        </h1>
        <p className="mx-auto max-w-[760px] text-[18px] leading-[28px] text-[#7e7e7e]">
          {description}
        </p>
      </div>
    </section>
  );
}

export function SectionTitle({
  title,
  highlight,
  description,
}: {
  title: string;
  highlight?: string;
  description?: string;
}) {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-6 text-[42px] font-bold leading-[46px] tracking-[-1.8px] text-[#2b2b2b]">
        {title}{" "}
        {highlight ? (
          <span className="bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] bg-clip-text text-transparent">
            {highlight}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p className="mx-auto max-w-[760px] text-[18px] text-[#7e7e7e]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function GradientCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-20 lg:px-[120px]">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        <h2 className="mb-6 text-[38px] font-bold leading-tight text-white lg:text-[46px]">
          {title}
        </h2>
        <p className="mx-auto mb-10 max-w-[640px] text-[18px] leading-[28px] text-white/90">
          {description}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            className="rounded-full bg-white px-8 py-4 font-medium text-[#f56969] shadow-lg"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="rounded-full border-2 border-white px-8 py-4 font-medium text-white transition-all hover:bg-white/10"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SurfaceCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[24px] bg-white p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
