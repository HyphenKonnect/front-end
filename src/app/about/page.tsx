import { aboutValues } from "../../components/site/data";
import { GradientCta, PageHero, SectionTitle, SurfaceCard } from "../../components/site/page-primitives";

const team = [
  { name: "Dr. Sarah Mitchell", role: "Chief Medical Officer", specialty: "Internal Medicine" },
  { name: "Dr. James Chen", role: "Head of Mental Health", specialty: "Clinical Psychology" },
  { name: "Maria Rodriguez, JD", role: "Legal Services Director", specialty: "Family Law" },
  { name: "Dr. Emily Thompson", role: "Wellness Program Lead", specialty: "Holistic Medicine" },
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
            <h2 className="mb-4 text-[32px] font-bold text-[#2b2b2b]">Our Mission</h2>
            <p className="text-[16px] leading-[26px] text-[#7e7e7e]">
              To provide accessible, compassionate, and comprehensive support through technology that connects people with licensed professionals they can trust.
            </p>
          </SurfaceCard>
          <SurfaceCard className="bg-gradient-to-br from-[#f7f5f4] to-white">
            <h2 className="mb-4 text-[32px] font-bold text-[#2b2b2b]">Our Vision</h2>
            <p className="text-[16px] leading-[26px] text-[#7e7e7e]">
              To create a world where quality healthcare, mental wellness, legal guidance, and holistic programs are within reach for everyone.
            </p>
          </SurfaceCard>
        </div>
      </section>

      <section className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle title="Our Core" highlight="Values" description="The principles that guide how we build the platform and support our community." />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {aboutValues.map((value) => (
              <SurfaceCard key={value.title}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                  <value.icon className="h-7 w-7 text-[#f56969]" />
                </div>
                <h3 className="mb-3 text-[20px] font-bold text-[#2b2b2b]">{value.title}</h3>
                <p className="text-[15px] leading-[24px] text-[#7e7e7e]">{value.description}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle title="Meet Our" highlight="Leadership" description="Experienced professionals dedicated to building a trusted care experience." />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-[24px] bg-[#f7f5f4] p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] text-[24px] font-bold text-white">
                  {member.name.split(" ").map((part) => part[0]).join("")}
                </div>
                <h3 className="mb-2 text-[18px] font-bold text-[#2b2b2b]">{member.name}</h3>
                <p className="mb-2 text-[14px] font-medium text-[#f56969]">{member.role}</p>
                <p className="text-[14px] text-[#7e7e7e]">{member.specialty}</p>
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
