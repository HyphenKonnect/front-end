import type { ReactNode } from "react";

const toneClasses = {
  success: "border-[#d5efde] bg-[#f4fbf6] text-[#24543b]",
  error: "border-[#ffd1cf] bg-[#fff3f2] text-[#8a3e3b]",
  info: "border-[#e7dff0] bg-[#faf7fc] text-[#5d4b72]",
} as const;

export function StatusBanner({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: keyof typeof toneClasses;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[24px] border p-5 text-sm ${toneClasses[tone]} ${className}`}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
