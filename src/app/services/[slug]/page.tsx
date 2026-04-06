import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  buildProfessionalCtaHref,
  professionals,
  serviceCatalog,
} from "../../../components/site/data";
import { GradientCta, PageHero } from "../../../components/site/page-primitives";

function renderRate(rate: string) {
  const sessionMatch = rate.match(/^Rs\.?\s*([\d,]+)\s*\/\s*session$/i);
  if (sessionMatch) {
    return (
      <div>
        <p className="text-[18px] font-bold leading-tight text-[#2b2b2b]">
          Rs. {sessionMatch[1]}
        </p>
        <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.12em] text-[#7e7e7e]">
          Per session
        </p>
      </div>
    );
  }

  return (
    <p className="text-[16px] font-bold leading-tight text-[#2b2b2b]">
      {rate}
    </p>
  );
}

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = serviceCatalog.find((item) => item.slug === slug);

  if (!service) notFound();

  const category =
    slug === "mental-wellness"
      ? "therapist"
      : slug === "medical-consultation"
        ? "doctor"
        : slug === "legal-guidance"
          ? "legal"
          : "wellness";

  const serviceProfessionals = professionals.filter(
    (professional) => professional.category === category,
  );

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Service Detail"
        title={service.title}
        description={service.description}
        backgroundImage={service.image}
      />

      <section className="bg-white px-6 py-16 lg:px-[120px] lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[34px] shadow-[0_24px_60px_rgba(29,25,22,0.12)]">
            <Image
              src={service.image}
              alt={service.title}
              width={1280}
              height={960}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1916]/55 via-transparent to-transparent" />
            <div className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/88 shadow-lg backdrop-blur-sm">
              <service.icon className="h-8 w-8 text-[#f56969]" />
            </div>
            <div className="absolute bottom-6 left-6 rounded-[22px] bg-white/88 px-5 py-4 shadow-xl backdrop-blur-sm">
              <p className="text-lg font-bold text-[#2b2b2b]">{service.specialists}</p>
              <p className="text-sm text-[#7e7e7e]">{service.availability}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-4 py-2 text-sm font-medium text-white">
              {service.tagline}
            </span>
            <h2 className="mb-5 text-[38px] font-bold leading-[42px] tracking-[-1.5px] text-[#2b2b2b] lg:text-[44px] lg:leading-[48px]">
              What this service includes
            </h2>
            <p className="mb-8 max-w-[560px] text-[17px] leading-[29px] text-[#6e6e6e]">
              {service.description} The goal is to make getting started feel simpler, clearer, and more supportive from the very first step.
            </p>

            <div className="mb-8 grid gap-3">
              {service.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-[20px] bg-[#faf7f6] px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f56969]" />
                  <span className="text-[15px] leading-6 text-[#2b2b2b]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e7e7e]">
                  Availability
                </p>
                <p className="mt-3 text-lg font-bold text-[#2b2b2b]">{service.availability}</p>
              </div>
              <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e7e7e]">
                  Team Strength
                </p>
                <p className="mt-3 text-lg font-bold text-[#2b2b2b]">{service.specialists}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/booking?service=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b2b2b] px-7 py-3.5 text-sm font-medium text-white transition-all hover:shadow-lg"
              >
                Book This Service
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/professionals"
                className="inline-flex items-center justify-center rounded-full border border-[#ead9e8] bg-white px-7 py-3.5 text-sm font-medium text-[#2b2b2b] transition-all hover:border-[#f4c3c7] hover:text-[#f56969]"
              >
                Browse Professionals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fcfbfb] px-6 py-16 lg:px-[120px] lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7e7e7e]">
                Matching Professionals
              </p>
              <h2 className="text-[34px] font-bold tracking-[-0.03em] text-[#2b2b2b] lg:text-[40px]">
                Meet the specialists for {service.title}
              </h2>
              <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#6e6e6e]">
                Choose from the professionals who currently support this care path,
                then either view their profile or start booking right away.
              </p>
            </div>
            <Link
              href={`/professionals?category=${category}`}
              className="text-sm font-medium text-[#f56969]"
            >
              View full directory
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceProfessionals.map((professional) => (
              <div
                key={professional.slug}
                className="overflow-hidden rounded-[28px] border border-[#efe7ec] bg-white shadow-[0_18px_42px_rgba(34,24,34,0.06)]"
              >
                <div className="bg-[linear-gradient(180deg,#ece1d7_0%,#f7f2ed_100%)] p-4 pb-0">
                  <Image
                    src={professional.image}
                    alt={professional.name}
                    width={720}
                    height={860}
                    className="h-[290px] w-full rounded-t-[24px] object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[24px] font-bold tracking-[-0.03em] text-[#2b2b2b]">
                        {professional.name}
                      </h3>
                      <p className="mt-1 text-[15px] font-medium text-[#f56969]">
                        {professional.specialty}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e7f8eb] px-3 py-1 text-xs font-semibold text-[#3e9560]">
                      {professional.available ? "Available" : "Waitlist"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-b border-[#f1e7ec] pb-5 text-[14px] text-[#6c6270]">
                    <div>
                      <p>{professional.experience} of experience</p>
                    </div>
                    <div className="text-right">
                      <p>{professional.location}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      {renderRate(professional.rate)}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <Link
                        href={`/professionals/${professional.slug}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d8d1d7] px-5 text-sm font-semibold text-[#2b2b2b] transition-colors hover:border-[#2b2b2b]"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={buildProfessionalCtaHref(professional)}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#2b2b2b] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#111111]"
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
        </div>
      </section>

      <GradientCta
        title={`Start with ${service.title}`}
        description="Begin the booking flow and we’ll help guide you to the right professional and the right next step."
        primaryHref={`/booking?service=${service.slug}`}
        primaryLabel="Book This Service"
        secondaryHref="/contact"
        secondaryLabel="Ask a Question"
      />
    </div>
  );
}
