import Link from "next/link";
import type { ReactNode } from "react";

const heroBackgrounds = [
  {
    match: ["about"],
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["contact", "touch"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["resources", "knowledge", "support center"],
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["service"],
    image:
      "https://images.unsplash.com/photo-1516549655669-df459aaff77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["professional", "expert"],
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["privacy", "terms", "policy"],
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
  {
    match: ["consultation", "session"],
    image:
      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  },
];

function getPageHeroBackground(eyebrow: string, title: string, highlight?: string) {
  const content = `${eyebrow} ${title} ${highlight || ""}`.toLowerCase();
  return (
    heroBackgrounds.find((item) =>
      item.match.some((keyword) => content.includes(keyword)),
    )?.image ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  backgroundImage,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  backgroundImage?: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-[120px] lg:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${backgroundImage || getPageHeroBackground(eyebrow, title, highlight)}")`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,250,248,0.68)_50%,rgba(255,255,255,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.3)_28%,rgba(255,255,255,0.3)_72%,rgba(255,255,255,0.56)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,145,45,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(230,185,230,0.18),transparent_32%)]" />
      <div className="relative mx-auto max-w-[1440px] text-center">
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
