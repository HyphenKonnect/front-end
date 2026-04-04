import { notFound } from "next/navigation";
import { serviceCatalog } from "../../../components/site/data";
import { GradientCta, PageHero } from "../../../components/site/page-primitives";

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = serviceCatalog.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Service Detail"
        title={service.title}
        highlight=""
        description={service.description}
      />
      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] shadow-2xl">
            <img src={service.image} alt={service.title} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-4 py-2 text-sm font-medium text-white">
              {service.tagline}
            </p>
            <h2 className="mb-6 text-[42px] font-bold leading-[46px] tracking-[-1.8px] text-[#2b2b2b]">{service.title}</h2>
            <p className="mb-8 text-[18px] leading-[28px] text-[#7e7e7e]">{service.description}</p>
            <div className="space-y-3">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="pt-1 text-[#f56969]">•</span>
                  <span className="text-[16px] text-[#2b2b2b]">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] bg-[#f7f5f4] p-6">
              <p className="text-[20px] font-bold text-[#2b2b2b]">{service.specialists}</p>
              <p className="text-[14px] text-[#7e7e7e]">{service.availability}</p>
            </div>
          </div>
        </div>
      </section>
      <GradientCta
        title={`Start with ${service.title}`}
        description="Begin the booking flow and get matched with the right professional for this service."
        primaryHref="/booking"
        primaryLabel="Book This Service"
        secondaryHref="/contact"
        secondaryLabel="Ask a Question"
      />
    </div>
  );
}
