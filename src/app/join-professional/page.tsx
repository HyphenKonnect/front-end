import { ProfessionalApplicationForm } from "../../components/professionals/ProfessionalApplicationForm";

export default function JoinProfessionalPage() {
  return (
    <section className="bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 pb-20 pt-28 lg:px-[120px] lg:pb-28 lg:pt-32">
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] bg-[#2b2b2b] p-8 text-white lg:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[#fcb4b3]">
            Professionals
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight lg:text-[52px]">
            Join the Hyphen Konnect network.
          </h1>
          <p className="text-base leading-7 text-white/75">
            We onboard professionals through our operations team to make sure
            every client receives trusted, verified care. Share your details
            and we will reach out with next steps.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              "Dedicated onboarding with credential verification.",
              "Structured scheduling, payments, and client coordination.",
              "Access to the professional dashboard after approval.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm text-white/85"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm lg:p-10">
          <p className="mb-2 text-sm font-medium text-[#f56969]">Apply now</p>
          <h2 className="mb-2 text-3xl font-bold text-[#2b2b2b]">
            Professional application
          </h2>
          <p className="mb-8 text-sm leading-6 text-[#7e7e7e]">
            This is not an instant sign-up. Our team reviews every application
            to ensure client safety and quality standards.
          </p>

          <ProfessionalApplicationForm />
        </div>
      </div>
    </section>
  );
}
