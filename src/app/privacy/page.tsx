import { PageHero } from "../../components/site/page-primitives";

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information needed to provide services, support bookings, improve the platform experience, and communicate with users appropriately.",
  },
  {
    title: "How We Use Information",
    body: "Information is used to operate the platform, coordinate services, maintain security, and support care experiences in line with applicable requirements.",
  },
  {
    title: "Privacy & Security",
    body: "We take privacy seriously and use secure systems, limited access controls, and careful handling practices to protect sensitive user information.",
  },
  {
    title: "Your Choices",
    body: "Users can contact the platform to request updates, clarifications, or support regarding their information and communication preferences.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Privacy Policy"
        title="Your Privacy"
        highlight="Matters"
        description="A clear overview of how platform information is handled, protected, and used to support the service experience."
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
