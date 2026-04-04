"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  href,
  className = "",
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#F5912D] via-[#F56969] to-[#E6B9E6] text-white shadow-lg hover:shadow-xl disabled:opacity-50",
    secondary: "bg-[#f7f5f4] text-[#F56969] border-2 border-[#F56969]",
    ghost: "text-[#2b2b2b] hover:text-[#F56969]",
    outline: "border-2 border-[#2b2b2b] text-[#2b2b2b]",
  };
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon && <span>{icon}</span>}
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
