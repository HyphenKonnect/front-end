import type { Metadata } from "next";
import { ConsultationRoom } from "../../../components/session/ConsultationRoom";
import { buildNoIndexMetadata } from "../../../lib/seo";

export async function generateMetadata(
  props: PageProps<"/consultation/[sessionId]">,
): Promise<Metadata> {
  const { sessionId } = await props.params;

  return buildNoIndexMetadata(
    `Consultation Session ${sessionId}`,
    "Secure online consultation room for a scheduled The Hyphen Konnect session.",
    `/consultation/${sessionId}`,
  );
}

export default async function ConsultationPage(props: PageProps<"/consultation/[sessionId]">) {
  const { sessionId } = await props.params;

  return <ConsultationRoom sessionId={sessionId} />;
}
