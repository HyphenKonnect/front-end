import { ConsultationRoom } from "../../../components/session/ConsultationRoom";

export default async function ConsultationPage(props: PageProps<"/consultation/[sessionId]">) {
  const { sessionId } = await props.params;

  return <ConsultationRoom sessionId={sessionId} />;
}
