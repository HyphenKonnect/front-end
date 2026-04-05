import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Globe2, MapPin, Sparkles } from "lucide-react";
import type { ProfessionalProfile } from "./data";

export function ProfessionalProfilePage({
  professional,
  relatedProfessionals,
}: {
  professional: ProfessionalProfile;
  relatedProfessionals: ProfessionalProfile[];
}) {
  return (
    <div className="bg-[#fcfbfb] pt-20">
      <section className="bg-white px-6 py-14 lg:px-[120px] lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 text-sm text-[#7e7e7e]">
            <Link href="/professionals" className="hover:text-[#f56969]">
              Professionals
            </Link>{" "}
            / <span className="text-[#2b2b2b]">{professional.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#ece1d7_0%,#f7f2ed_100%)] p-4 pb-0 shadow-sm">
              <img
                src={professional.image}
                alt={professional.name}
                className="h-full min-h-[460px] w-full rounded-t-[28px] object-cover object-[center_20%]"
              />
            </div>

            <div className="flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-white via-[#fff8f5] to-[#fff3fb] p-8 shadow-sm lg:p-10">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#ffe9e3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f56969]">
                    {professional.category}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-[#7e7e7e] shadow-sm">
                    {professional.available ? "Available for consultations" : "Waitlist"}
                  </span>
                </div>

                <h1 className="text-[40px] font-bold leading-tight tracking-[-0.04em] text-[#2b2b2b] lg:text-[52px]">
                  {professional.name}
                </h1>
                <p className="mt-3 text-xl font-medium text-[#f56969]">
                  {professional.specialty}
                </p>
                <p className="mt-6 max-w-[760px] text-[17px] leading-8 text-[#5f5f5f]">
                  {professional.intro}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <ProfileFact icon={Award} label="Experience" value={professional.experience} />
                  <ProfileFact icon={MapPin} label="Location" value={professional.location} />
                  <ProfileFact icon={Globe2} label="Languages" value={professional.languages.join(", ")} />
                  <ProfileFact icon={Sparkles} label="Session fee" value={professional.rate} />
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 font-medium text-white shadow-lg"
                >
                  Book a session
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-[#ead9e8] px-8 py-4 font-medium text-[#2b2b2b]"
                >
                  Ask a question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <ContentCard title="About">
              <div className="space-y-4 text-[16px] leading-8 text-[#5f5f5f]">
                {professional.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ContentCard>

            <ContentCard title="Areas of expertise">
              <div className="grid gap-4 md:grid-cols-2">
                {professional.expertise.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[20px] bg-[#fcfbfb] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f56969]" />
                    <p className="text-[15px] leading-6 text-[#2b2b2b]">{item}</p>
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>

            <div className="space-y-8">
            <ContentCard title="Qualifications">
              <div className="space-y-3">
                {professional.qualifications.map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[#fcfbfb] px-4 py-3 text-[15px] leading-6 text-[#2b2b2b]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </ContentCard>

            {professional.workingHours || professional.daysOff ? (
              <ContentCard title="Availability details">
                <div className="space-y-4 text-[15px] leading-7 text-[#5f5f5f]">
                  {professional.workingHours ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#7e7e7e]">
                        Working hours
                      </p>
                      <p className="mt-2">{professional.workingHours}</p>
                    </div>
                  ) : null}
                  {professional.daysOff ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#7e7e7e]">
                        Days off
                      </p>
                      <p className="mt-2">{professional.daysOff}</p>
                    </div>
                  ) : null}
                </div>
              </ContentCard>
            ) : null}

            <ContentCard title="Therapeutic / consultation approach">
              <p className="text-[16px] leading-8 text-[#5f5f5f]">
                {professional.approach}
              </p>
            </ContentCard>

            {professional.feeCards?.length ? (
              <ContentCard title="Fee cards">
                <div className="space-y-3">
                  {professional.feeCards.map((item) => (
                    <div
                      key={`${item.label}-${item.price}`}
                      className="flex items-center justify-between rounded-[18px] bg-[#fcfbfb] px-4 py-3"
                    >
                      <p className="text-[15px] text-[#2b2b2b]">{item.label}</p>
                      <p className="text-[15px] font-semibold text-[#f56969]">
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentCard>
            ) : null}

            <ContentCard title="Need help choosing?">
              <p className="text-[16px] leading-8 text-[#5f5f5f]">
                If you are unsure whether this professional is the right fit,
                our team can guide you toward the right support based on your
                goals and comfort.
              </p>
              <div className="mt-6 rounded-[20px] bg-[#fcfbfb] p-4 text-[14px] leading-7 text-[#5f5f5f]">
                Platform note: public pricing on The Hyphen Konnect starts from
                Rs. 1500, and exact fees or available time slots depend on the
                professional and session type you choose in the booking flow.
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex rounded-full bg-[#2b2b2b] px-6 py-3 text-sm font-medium text-white"
              >
                Contact our team
              </Link>
            </ContentCard>

            <ContentCard title="Booking and availability">
              <p className="text-[16px] leading-8 text-[#5f5f5f]">
                Choose your preferred date and time in the booking flow to view
                the latest session availability for this professional. We are
                keeping live time slots tied to the platform booking system so
                availability stays current.
              </p>
              <Link
                href="/booking"
                className="mt-6 inline-flex rounded-full border border-[#ead9e8] px-6 py-3 text-sm font-medium text-[#2b2b2b]"
              >
                Check available sessions
              </Link>
            </ContentCard>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7e7e7e]">
                More Professionals
              </p>
              <h2 className="text-[36px] font-bold tracking-[-0.03em] text-[#2b2b2b]">
                Explore similar experts
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-[#f56969]">
              View all professionals
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProfessionals.map((item) => (
              <Link
                key={item.slug}
                href={`/professionals/${item.slug}`}
                className="overflow-hidden rounded-[24px] bg-[#f7f5f4] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-[linear-gradient(180deg,#ece1d7_0%,#f7f2ed_100%)] p-3 pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[255px] w-full rounded-t-[22px] object-cover object-[center_20%]"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[20px] font-bold text-[#2b2b2b]">{item.name}</p>
                  <p className="mt-2 text-[15px] font-medium text-[#f56969]">
                    {item.specialty}
                  </p>
                  <p className="mt-3 text-[14px] text-[#7e7e7e]">
                    {item.location} · {item.experience}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm">
      <h2 className="mb-5 text-[28px] font-bold tracking-[-0.03em] text-[#2b2b2b]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ProfileFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Award;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] bg-white/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1ea]">
          <Icon className="h-5 w-5 text-[#f56969]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#7e7e7e]">
            {label}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#2b2b2b]">{value}</p>
        </div>
      </div>
    </div>
  );
}
