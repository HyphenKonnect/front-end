"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  size = "md",
  interactive = false,
}: CardProps) {
  const sizeClasses = {
    sm: "p-4 rounded-lg",
    md: "p-6 rounded-[16px]",
    lg: "p-8 rounded-[24px]",
  };
  const baseClasses = `bg-white shadow-sm ${interactive ? "hover:shadow-md cursor-pointer transition-all" : ""}`;
  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
