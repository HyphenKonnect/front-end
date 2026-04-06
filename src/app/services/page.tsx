import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { serviceCatalog } from "../../components/site/data";
import {
  GradientCta,
  PageHero,
  SectionTitle,
} from "../../components/site/page-primitives";

const benefits = [
  {
    title: "Online-first support",
    description:
      "Every service is designed for a calm, accessible online experience without travel stress or long waiting room delays.",
  },
  {
    title: "Verified expertise",
    description:
      "Professionals are mapped by specialization so clients can move toward the right kind of support with more confidence.",
  },
  {
    title: "Flexible session flow",
    description:
      "From one-time consultations to deeper recurring support, the platform can guide people into the right pace of care.",
  },
  {
    title: "Cross-functional care",
    description:
      "Mental, medical, legal, and wellness services can work together when a client’s needs overlap across life areas.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Our Services"
        title="Support Designed Around"
        highlight="Real Life Needs"
        description="Explore the four care paths at the heart of Hyphen Konnect, each shaped to feel clear, human, and easy to begin."
        backgroundImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
      />

      <section className="relative overflow-hidden bg-[#f7f5f4] px-6 py-16 lg:px-[120px] lg:py-20">
        <div className="absolute left-[-120px] top-20 h-[260px] w-[260px] rounded-full bg-[#f5912d]/8 blur-3xl" />
        <div className="absolute bottom-10 right-[-80px] h-[300px] w-[300px] rounded-full bg-[#e6b9e6]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] space-y-12">
          {serviceCatalog.map((service, index) => (
            <div
              key={service.slug}
              className={`grid gap-8 rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(29,25,22,0.05)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-8 ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="relative h-full overflow-hidden rounded-[30px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={1200}
                    height={900}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b18]/50 via-transparent to-transparent" />
                  <div className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/88 shadow-lg backdrop-blur-sm">
                    <service.icon className="h-8 w-8 text-[#f56969]" />
                  </div>
                  <div className="absolute bottom-6 left-6 rounded-[20px] bg-white/88 px-5 py-4 shadow-lg backdrop-blur-sm">
                    <p className="text-lg font-bold text-[#2b2b2b]">{service.specialists}</p>
                    <p className="text-sm text-[#7e7e7e]">{service.availability}</p>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col justify-center ${
                  index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }`}
              >
                <span className="mb-5 inline-flex w-fit rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-4 py-2 text-sm font-medium text-white">
                  {service.tagline}
                </span>
                <h2 className="mb-5 text-[38px] font-bold leading-[42px] tracking-[-1.6px] text-[#2b2b2b] lg:text-[44px] lg:leading-[48px]">
                  {service.title}
                </h2>
                <p className="mb-8 max-w-[560px] text-[17px] leading-[29px] text-[#6e6e6e]">
                  {service.description}
                </p>

                <div className="mb-8 grid gap-3 sm:grid-cols-2">
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

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b2b2b] px-7 py-3.5 text-sm font-medium text-white transition-all hover:shadow-lg"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/booking?service=${service.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-[#ead9e8] bg-white px-7 py-3.5 text-sm font-medium text-[#2b2b2b] transition-all hover:border-[#f4c3c7] hover:text-[#f56969]"
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle
            title="Why These Services Feel"
            highlight="More Supportive"
            description="The experience is built to reduce confusion and help people move from uncertainty into the right next step."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[28px] border border-[#f0e6e4] bg-[#fcfbfb] p-7 shadow-sm"
              >
                <div className="mb-5 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]" />
                <h3 className="mb-3 text-[22px] font-bold text-[#2b2b2b]">
                  {benefit.title}
                </h3>
                <p className="text-[15px] leading-7 text-[#7e7e7e]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Need Help Choosing the Right Service?"
        description="Start with a booking request or talk to our team and we’ll help guide you toward the care path that fits best."
        primaryHref="/booking"
        primaryLabel="Start Booking"
        secondaryHref="/contact"
        secondaryLabel="Talk to Our Team"
      />
    </div>
  );
}
