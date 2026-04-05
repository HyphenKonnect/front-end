import Link from "next/link";
import type { ReactNode } from "react";

export function DashboardShell({
  title,
  description,
  accent,
  actions,
  children,
}: {
  title: string;
  description: string;
  accent: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-[#fcfbfb] px-6 py-24 lg:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-6 rounded-[32px] bg-white p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-10">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#f56969]">
              {accent}
            </p>
            <h1 className="mb-3 text-4xl font-bold tracking-[-0.03em] text-[#2b2b2b] lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-[760px] text-base leading-7 text-[#7e7e7e]">
              {description}
            </p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function DashboardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-12">{children}</div>;
}

export function DashboardCard({
  title,
  eyebrow,
  className = "",
  children,
}: {
  title: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[28px] bg-white p-7 shadow-sm ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f56969]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-5 text-2xl font-bold text-[#2b2b2b]">{title}</h2>
      {children}
    </div>
  );
}

export function StatList({
  items,
}: {
  items: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[22px] bg-[#f7f5f4] p-5">
          <p className="text-sm text-[#7e7e7e]">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-[#2b2b2b]">{item.value}</p>
          {item.note ? (
            <p className="mt-2 text-sm text-[#7e7e7e]">{item.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#ead9e8] bg-[#fcfbfb] p-6">
      <p className="text-lg font-semibold text-[#2b2b2b]">{title}</p>
      <p className="mt-2 max-w-[540px] text-sm leading-6 text-[#7e7e7e]">
        {description}
      </p>
      {href && label ? (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-full bg-[#2b2b2b] px-5 py-2.5 text-sm font-medium text-white"
        >
          {label}
        </Link>
      ) : null}
    </div>
  );
}
