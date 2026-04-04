"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Users } from "lucide-react";
import { faqItems, resourceItems } from "../../components/site/data";
import { GradientCta, PageHero, SectionTitle } from "../../components/site/page-primitives";

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Resources & Support"
        title="Knowledge &"
        highlight="Support Center"
        description="Helpful resources, guides, and answers to common questions about the platform and services."
      />

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle title="Featured" highlight="Resources" description="Educational content to support your wellness journey." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {resourceItems.map((resource) => (
              <div key={resource.title} className="group cursor-pointer rounded-[24px] bg-[#f7f5f4] p-6 transition-all hover:shadow-lg">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10 transition-transform group-hover:scale-110">
                  <resource.icon className="h-7 w-7 text-[#f56969]" />
                </div>
                <span className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-[12px] font-medium text-[#f56969]">
                  {resource.category}
                </span>
                <h3 className="mb-2 text-[18px] font-bold text-[#2b2b2b]">{resource.title}</h3>
                <p className="mb-4 text-[14px] text-[#7e7e7e]">{resource.description}</p>
                <p className="text-[13px] font-medium text-[#f56969]">{resource.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#f7f5f4] to-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] p-12 text-center text-white lg:p-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Users className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-[36px] font-bold lg:text-[42px]">Are You a Professional?</h2>
            <p className="mx-auto mb-8 max-w-[720px] text-[18px] leading-[28px] text-white/90">
              Access the professional experience to manage your schedule, clients, and sessions, or reach out if you want to join the network.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/professionals" className="rounded-full bg-white px-8 py-4 font-medium text-[#f56969] shadow-lg">
                Access Employee Portal
              </Link>
              <a href="mailto:careers@thehyphenkonnect.com" className="rounded-full border-2 border-white px-8 py-4 font-medium text-white">
                Join Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[900px]">
          <SectionTitle title="Frequently Asked" highlight="Questions" />
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={faq.question} className="overflow-hidden rounded-[20px] bg-[#f7f5f4]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-8 py-6 text-left"
                >
                  <h3 className="pr-4 text-[18px] font-bold text-[#2b2b2b]">{faq.question}</h3>
                  <ChevronDown className={`h-6 w-6 text-[#f56969] transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index ? (
                  <div className="px-8 pb-6">
                    <p className="text-[16px] leading-[26px] text-[#7e7e7e]">{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Still Looking for Answers?"
        description="Reach out to the team or start your booking flow and we’ll guide you from there."
        primaryHref="/contact"
        primaryLabel="Contact Support"
        secondaryHref="/booking"
        secondaryLabel="Book a Session"
      />
    </div>
  );
}
