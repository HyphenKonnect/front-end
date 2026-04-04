import Link from "next/link";
import { serviceCatalog } from "../../components/site/data";
import { GradientCta, PageHero, SectionTitle } from "../../components/site/page-primitives";

const benefits = [
  "Secure video sessions",
  "Flexible scheduling",
  "Verified professionals",
  "Confidential care experience",
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Our Services"
        title="Comprehensive"
        highlight="Healthcare Solutions"
        description="Expert care across mental wellness, medical consultation, legal guidance, and holistic wellness programs."
      />

      <section className="bg-[#f7f5f4] px-6 py-16 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px] space-y-24">
          {serviceCatalog.map((service, index) => (
            <div key={service.slug} className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
                  <img src={service.image} alt={service.title} className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute left-8 top-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] shadow-lg">
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="relative -mt-10 ml-auto w-fit rounded-[24px] bg-white p-6 shadow-xl">
                  <p className="text-[20px] font-bold text-[#2b2b2b]">{service.specialists}</p>
                  <p className="text-[14px] text-[#7e7e7e]">{service.availability}</p>
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-4 py-2 text-[14px] font-medium text-white">
                  {service.tagline}
                </span>
                <h2 className="mb-6 text-[42px] font-bold leading-[46px] tracking-[-1.8px] text-[#2b2b2b]">
                  {service.title}
                </h2>
                <p className="mb-8 text-[18px] leading-[28px] text-[#7e7e7e]">{service.description}</p>
                <div className="mb-8 space-y-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="pt-1 text-[#f56969]">•</span>
                      <span className="text-[16px] text-[#2b2b2b]">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/services/${service.slug}`} className="inline-flex rounded-full bg-[#2b2b2b] px-6 py-3 font-medium text-white">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle title="Why Clients Choose These" highlight="Services" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-[24px] bg-[#f7f5f4] p-6 text-center text-[16px] font-medium text-[#2b2b2b]">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Not Sure Which Service Fits Best?"
        description="Start with a booking request and we can help match you with the right support path."
        primaryHref="/booking"
        primaryLabel="Start Booking"
        secondaryHref="/contact"
        secondaryLabel="Talk to Our Team"
      />
    </div>
  );
}
