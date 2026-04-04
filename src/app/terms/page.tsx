import { PageHero } from "../../components/site/page-primitives";

const sections = [
  {
    title: "Using the Platform",
    body: "Users agree to use the platform responsibly, provide accurate information, and respect the intended use of services, bookings, and communications.",
  },
  {
    title: "Professional Services",
    body: "Services may be delivered by licensed professionals through the platform. Availability, suitability, and outcomes can vary based on individual circumstances.",
  },
  {
    title: "Bookings & Payments",
    body: "Session scheduling, fees, and related policies are communicated during the booking flow. Changes or cancellations may be subject to platform policies.",
  },
  {
    title: "Support & Contact",
    body: "If you have questions about these terms or need help understanding how they apply, please contact the platform support team.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Terms of Service"
        title="Platform"
        highlight="Terms"
        description="An overview of the expectations, responsibilities, and policies that shape use of the platform."
      />
      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[900px] space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="rounded-[24px] bg-[#f7f5f4] p-8">
              <h2 className="mb-4 text-[28px] font-bold text-[#2b2b2b]">{section.title}</h2>
              <p className="text-[16px] leading-[28px] text-[#7e7e7e]">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
