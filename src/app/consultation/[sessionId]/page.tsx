import Link from "next/link";
import { PageHero } from "../../../components/site/page-primitives";

export default async function ConsultationPage(props: PageProps<"/consultation/[sessionId]">) {
  const { sessionId } = await props.params;

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Video Consultation"
        title="Session Ready:"
        highlight={sessionId}
        description="This page represents the consultation room entry from the Figma flow. It can later be connected to a real video/session backend."
      />
      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[900px] rounded-[28px] bg-[#f7f5f4] p-10 text-center">
          <h2 className="mb-4 text-[32px] font-bold text-[#2b2b2b]">Your Session Lobby</h2>
          <p className="mb-8 text-[18px] leading-[28px] text-[#7e7e7e]">
            Check your camera, audio, and connection before joining. The full real-time consultation logic can be added later.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button type="button" className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 font-medium text-white">
              Join Session
            </button>
            <Link href="/booking" className="rounded-full border border-[#2b2b2b] px-8 py-4 font-medium text-[#2b2b2b]">
              Back to Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
