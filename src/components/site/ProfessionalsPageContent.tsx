"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { professionalCategories, professionals } from "./data";
import { GradientCta, PageHero, SectionTitle } from "./page-primitives";

export function ProfessionalsPageContent({
  initialCategory = "all",
}: {
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    return professionals.filter((professional) => {
      const matchesCategory =
        category === "all" || professional.category === category;
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm]);

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
            {filtered.map((professional) => (
              <div key={professional.id} className="overflow-hidden rounded-[24px] bg-[#f7f5f4] shadow-sm">
                <img src={professional.image} alt={professional.name} className="h-[240px] w-full object-cover" />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[20px] font-bold text-[#2b2b2b]">{professional.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${professional.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {professional.available ? "Available" : "Waitlist"}
                    </span>
                  </div>
                  <p className="mb-3 text-[15px] font-medium text-[#f56969]">{professional.specialty}</p>
                  <div className="mb-4 flex items-center gap-4 text-[14px] text-[#7e7e7e]">
                    <span>{professional.experience}</span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#f5912d] text-[#f5912d]" />
                      {professional.rating} ({professional.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#ead9e8] pt-4">
                    <span className="text-[18px] font-bold text-[#2b2b2b]">{professional.rate}</span>
                    <Link href="/booking" className="rounded-full bg-[#2b2b2b] px-5 py-2.5 text-sm font-medium text-white">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <div key={item} className="rounded-[24px] bg-white p-6 text-[16px] text-[#2b2b2b] shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Want to Join as a Professional?"
        description="If you’re licensed and interested in building your practice with us, get in touch and we’ll walk you through the process."
        primaryHref="/contact"
        primaryLabel="Apply to Join"
        secondaryHref="/booking"
        secondaryLabel="Explore Booking"
      />
    </div>
  );
}
