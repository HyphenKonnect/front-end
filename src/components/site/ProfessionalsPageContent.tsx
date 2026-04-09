"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import {
  buildProfessionalCtaHref,
  mapBackendProfessionalToDirectory,
  professionalCategories,
  professionals,
  type BackendProfessionalRecord,
  type DirectoryProfessional,
} from "./data";
import { GradientCta, PageHero, SectionTitle } from "./page-primitives";
import { apiFetch, parseJsonResponse } from "../../lib/api";

function renderRate(rate: string) {
  const sessionMatch = rate.match(/^Rs\.?\s*([\d,]+)\s*\/\s*session$/i);
  if (sessionMatch) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-bold leading-tight text-[#2b2b2b] sm:text-[18px]">
          Rs. {sessionMatch[1]}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7e7e7e] sm:text-[12px]">
          Per session
        </p>
      </div>
    );
  }

  return (
    <p className="text-[14px] font-bold leading-tight text-[#2b2b2b] sm:text-[16px]">
      {rate.replace(/^Rs\.?\s*/i, "Rs. ")}
    </p>
  );
}

export function ProfessionalsPageContent({
  initialCategory = "all",
}: {
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [directory, setDirectory] = useState<DirectoryProfessional[]>(professionals);
  const fallbackDirectory = useMemo<DirectoryProfessional[]>(
    () => professionals.map((professional) => ({
      id: professional.id,
      slug: professional.slug,
      name: professional.name,
      specialty: professional.specialty,
      category: professional.category,
      image: professional.image,
      rating: professional.rating,
      reviews: professional.reviews,
      experience: professional.experience,
      rate: professional.rate,
      available: professional.available,
      location: professional.location,
      workingHours: professional.workingHours,
      daysOff: professional.daysOff,
      bookingMode: professional.bookingMode,
      packageSessions: professional.packageSessions,
    })),
    [],
  );

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;

    const loadProfessionals = async () => {
      try {
        const response = await apiFetch("/api/professionals");
        const data = await parseJsonResponse<BackendProfessionalRecord[]>(response);
        if (!Array.isArray(data) || cancelled) return;

        setDirectory(data.map(mapBackendProfessionalToDirectory));
      } catch {
        // Keep local fallback data when the backend is unavailable.
      }
    };

    void loadProfessionals();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return directory.filter((professional) => {
      const matchesCategory =
        category === "all" || professional.category === category;
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, directory, searchTerm]);

  const fallbackFiltered = useMemo(() => {
    return fallbackDirectory.filter((professional) => {
      const matchesCategory =
        category === "all" || professional.category === category;
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, fallbackDirectory, searchTerm]);

  const displayedProfessionals = filtered.length ? filtered : fallbackFiltered;

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Professionals"
        title="Find Your"
        highlight="Expert Match"
        description="Browse trusted therapists, doctors, legal advisors, and wellness coaches available through the platform."
      />

      <section className="bg-white px-6 py-12 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {professionalCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                    category === item.id
                      ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] text-white shadow-md"
                      : "bg-[#f7f5f4] text-[#2b2b2b]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-[320px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7e7e7e]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search professionals"
                className="w-full rounded-full border border-[#ead9e8] bg-[#f7f5f4] py-3 pl-11 pr-4 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedProfessionals.map((professional) => (
              <div
                key={professional.id}
                className="overflow-hidden rounded-[28px] border border-[#e9e2df] bg-white shadow-[0_14px_36px_rgba(29,25,22,0.06)]"
              >
                <div className="bg-[#f4efeb] p-3">
                  <Image
                    src={professional.image}
                    alt={professional.name}
                    width={720}
                    height={840}
                    className="h-[280px] w-full rounded-[18px] object-cover object-[center_20%]"
                  />
                </div>
                <div className="p-6 pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[24px] font-bold text-[#2b2b2b]">
                        {professional.name}
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[#f56969]">
                        {professional.specialty}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
                        professional.available
                          ? "border-[#ffd5cf] text-[#f56969]"
                          : "border-[#dfdfdf] text-[#7a7a7a]"
                      }`}
                    >
                      {professional.available ? "Online" : "Waitlist"}
                    </span>
                  </div>

                  <div className="mb-4 grid gap-3 text-[14px] text-[#6f6f6f]">
                    <div className="flex items-center justify-between gap-4">
                      <span>{professional.experience} of experience</span>
                      {professional.rating > 0 && professional.reviews > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#f5912d] text-[#f5912d]" />
                          {professional.rating} ({professional.reviews})
                        </span>
                      ) : (
                        <span className="text-[#7e7e7e]">Verified profile</span>
                      )}
                    </div>
                    {professional.location ? (
                      <div className="flex items-center justify-between gap-4">
                        <span>{professional.location}</span>
                        <span className="text-[#7e7e7e]">Online consultation</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-[#eee6e3] pt-5">
                    <div className="mb-4 min-w-0">
                      {renderRate(professional.rate)}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {professional.slug ? (
                        <Link
                          href={`/professionals/${professional.slug}`}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#2b2b2b]/20 px-3 py-2 text-center text-[12px] font-semibold leading-tight text-[#2b2b2b] sm:min-h-[48px] sm:px-4 sm:text-[13px]"
                        >
                          View Profile
                        </Link>
                      ) : (
                        <div />
                      )}
                      <Link
                        href={buildProfessionalCtaHref(professional)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#2b2b2b] px-3 py-2 text-center text-[12px] font-semibold leading-tight text-white shadow-sm sm:min-h-[48px] sm:px-4 sm:text-[13px]"
                      >
                        {professional.bookingMode === "request"
                          ? "Request Session"
                          : professional.bookingMode === "package"
                            ? "Book Package"
                            : "Book Now"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!displayedProfessionals.length ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#ead9e8] bg-[#fcfbfb] p-6 text-sm text-[#7e7e7e]">
              No professionals match this category right now. Try another category or search term.
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle title="Why Professionals Join" highlight="The Platform" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Flexible scheduling and independent practice support",
              "Access to a growing client base",
              "Secure platform and operational tooling",
              "Professional visibility and trust signals",
              "Support for session management and follow-up",
              "A care-first brand aligned with meaningful impact",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] bg-white p-6 text-[16px] text-[#2b2b2b] shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Want to Join as a Professional?"
        description="If you're licensed and interested in building your practice with us, get in touch and we'll walk you through the process."
        primaryHref="/contact"
        primaryLabel="Apply to Join"
        secondaryHref="/booking"
        secondaryLabel="Explore Booking"
      />
    </div>
  );
}
