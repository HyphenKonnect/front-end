import Image from "next/image";
import { aboutValues } from "../../components/site/data";
import {
  GradientCta,
  PageHero,
  SectionTitle,
  SurfaceCard,
} from "../../components/site/page-primitives";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "About Our Mental Wellness and Holistic Support Platform",
  description:
    "Learn about The Hyphen Konnect, our mission, leadership, and values behind our online mental wellness, medical, legal, and wellness support platform.",
  path: "/about",
  keywords: [
    "about The Hyphen Konnect",
    "mental wellness company India",
    "holistic support platform India",
    "online care platform mission",
  ],
});

const team = [
  {
    name: "Yogitha Rao",
    role: "Founder & CEO",
    image: "/yogitha-Rao.png",
    specialty:
      "An ISB graduate, Yogitha founded THK to bridge the critical gap in support for abuse survivors and those seeking holistic wellness. With a vision to create a one-stop platform for mental health, medical, and legal care, she is committed to ensuring that every individual who reaches out finds healing, strength, and hope.",
  },
  {
    name: "Sreshta Rao",
    role: "Co-Founder & Head, Legal Counsel",
    image: "/sreshta-Rao.png",
    specialty:
      "Sreshta holds a Human Rights Law degree from the University of Edinburgh and extensive experience across NGOs. She has also worked for the rights of Afghan refugees in the UK, strengthening her global perspective on justice. With a dedicated team of lawyers, she offers expert legal support to survivors of abuse.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="About Us"
        title="Connecting People,"
        highlight="Care & Courage"
        description="The Hyphen Konnect bridges the gap between challenges and support, making expert care more accessible, affordable, and human."
      />

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-2">
          <SurfaceCard className="bg-gradient-to-br from-[#f7f5f4] to-white">
            <h2 className="mb-4 text-[32px] font-bold text-[#2b2b2b]">
              Our Mission
            </h2>
            <p className="text-[16px] leading-[26px] text-[#7e7e7e]">
              To provide accessible, compassionate, and comprehensive support
              through technology that connects people with licensed
              professionals they can trust.
            </p>
          </SurfaceCard>
          <SurfaceCard className="bg-gradient-to-br from-[#f7f5f4] to-white">
            <h2 className="mb-4 text-[32px] font-bold text-[#2b2b2b]">
              Our Vision
            </h2>
            <p className="text-[16px] leading-[26px] text-[#7e7e7e]">
              To create a world where quality healthcare, mental wellness, legal
              guidance, and holistic programs are within reach for everyone.
            </p>
          </SurfaceCard>
        </div>
      </section>

      <section className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle
            title="Our Core"
            highlight="Values"
            description="The principles that guide how we build the platform and support our community."
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {aboutValues.map((value) => (
              <SurfaceCard key={value.title}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                  <value.icon className="h-7 w-7 text-[#f56969]" />
                </div>
                <h3 className="mb-3 text-[20px] font-bold text-[#2b2b2b]">
                  {value.title}
                </h3>
                <p className="text-[15px] leading-[24px] text-[#7e7e7e]">
                  {value.description}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle
            title="Meet Our"
            highlight="Leadership"
            description="Experienced professionals dedicated to building a trusted care experience."
          />
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="w-full overflow-hidden rounded-[24px] bg-[#f7f5f4] transition-transform hover:shadow-lg sm:w-[90%] md:w-[45%] lg:w-[500px]"
              >
                {/* Image Section */}
                <div className="relative h-96 w-full overflow-hidden bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 500px, (min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-[64px] font-bold text-white">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="mb-2 text-[22px] font-bold text-[#2b2b2b]">
                    {member.name}
                  </h3>
                  <p className="mb-4 text-[15px] font-medium text-[#f56969]">
                    {member.role}
                  </p>
                  <p className="text-[15px] leading-[24px] text-[#7e7e7e]">
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCta
        title="Want to Learn More About Us?"
        description="Explore our services or reach out to the team if you want help finding the right place to begin."
        primaryHref="/services"
        primaryLabel="Explore Services"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </div>
  );
}
