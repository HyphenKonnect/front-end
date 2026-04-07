"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  ChevronDown,
  Heart,
  Menu,
  Scale,
  Stethoscope,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { roleToDashboard } from "../auth/ProtectedRoute";
import { NotificationBell } from "./NotificationBell";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Professionals", href: "/professionals", hasDropdown: true },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const professionalCategories = [
  {
    icon: Brain,
    label: "Therapist",
    description: "Mental health professionals",
    href: "/professionals?category=therapist",
  },
  {
    icon: Stethoscope,
    label: "Medical Doctor",
    description: "Healthcare physicians",
    href: "/professionals?category=doctor",
  },
  {
    icon: Scale,
    label: "Legal Advisor",
    description: "Licensed attorneys",
    href: "/professionals?category=legal",
  },
  {
    icon: Heart,
    label: "Wellness Coach",
    description: "Holistic health experts",
    href: "/professionals?category=wellness",
  },
];

export function Navigation() {
  const router = useRouter();
  const { isAuthenticated, signOut, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfessionalsOpen, setIsProfessionalsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const dashboardHref = user ? roleToDashboard(user.role) : "/login";

  const handleSignOut = () => {
    signOut();
    closeMobileMenu();
    router.push("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-[120px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand-logo.png"
              alt="The Hyphen Konnect"
              width={174}
              height={112}
              priority
              className="h-auto w-[86px] lg:w-[104px]"
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative py-2"
                onMouseEnter={() =>
                  item.hasDropdown && setIsProfessionalsOpen(true)
                }
                onMouseLeave={() =>
                  item.hasDropdown && setIsProfessionalsOpen(false)
                }
              >
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-1 text-base font-medium text-[#2b2b2b] transition-colors hover:text-[#f56969]"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isProfessionalsOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] transition-all duration-300 group-hover:w-full" />
                </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {isProfessionalsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full w-[320px] pt-2"
                      >
                        <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-2xl">
                          <div className="p-6">
                            <p className="mb-4 text-sm text-[#7e7e7e]">
                              Find an expert who understands your needs
                            </p>
                            <div className="mb-4 space-y-2">
                              {professionalCategories.map((category) => (
                                <Link
                                  key={category.label}
                                  href={category.href}
                                  className="group flex items-center gap-3 rounded-[16px] p-3 transition-all hover:bg-gradient-to-r hover:from-[#f5912d]/5 hover:via-[#f56969]/5 hover:to-[#e6b9e6]/5"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10 transition-all group-hover:from-[#f5912d]/20 group-hover:via-[#f56969]/20 group-hover:to-[#e6b9e6]/20">
                                    <category.icon className="h-5 w-5 text-[#f56969]" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-[#2b2b2b]">
                                      {category.label}
                                    </p>
                                    <p className="text-xs text-[#7e7e7e]">
                                      {category.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/contact"
                              className="flex items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] p-3 text-white transition-all hover:shadow-lg"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <UserPlus className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Join as a Professional
                                </p>
                                <p className="text-xs text-white/80">
                                  Start your practice with us
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link
                  href={dashboardHref}
                  className="font-medium text-[#2b2b2b] transition-colors hover:text-[#f56969]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="font-medium text-[#2b2b2b] transition-colors hover:text-[#f56969]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-medium text-[#2b2b2b] transition-colors hover:text-[#f56969]"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/booking"
              className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-2.5 font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              Book Session
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="p-2 text-[#2b2b2b] transition-colors hover:text-[#f56969] lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-[68px] z-40 max-h-[calc(100vh-68px)] overflow-y-auto bg-white shadow-lg lg:hidden"
          >
            <div className="space-y-4 px-6 py-8 pb-24">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block py-2 text-lg font-medium text-[#2b2b2b] transition-colors hover:text-[#f56969]"
                  >
                    {item.label}
                  </Link>
                  {item.hasDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {professionalCategories.map((category) => (
                        <Link
                          key={category.label}
                          href={category.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded-[12px] p-2 transition-all hover:bg-[#f7f5f4]"
                        >
                          <category.icon className="h-4 w-4 text-[#f56969]" />
                          <span className="text-sm text-[#2b2b2b]">
                            {category.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="space-y-3 border-t border-[#f1ece9] pt-5">
                {isAuthenticated ? (
                  <>
                    <div className="flex justify-center">
                      <NotificationBell />
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={closeMobileMenu}
                      className="block w-full rounded-full border-2 border-[#2b2b2b] px-6 py-3 text-center font-medium text-[#2b2b2b] transition-all hover:bg-[#2b2b2b] hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full rounded-full border-2 border-[#ead9e8] px-6 py-3 text-center font-medium text-[#2b2b2b]"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block w-full rounded-full border-2 border-[#2b2b2b] px-6 py-3 text-center font-medium text-[#2b2b2b] transition-all hover:bg-[#2b2b2b] hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/booking"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-3 text-center font-medium text-white"
                >
                  Book Session
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
