import { VideoTestLauncher } from "../../components/session/VideoTestLauncher";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Daily Video Test",
  "Create a dummy booking and open a Daily consultation room for testing.",
  "/video-test",
);

export default function VideoTestPage() {
  return <VideoTestLauncher />;
}
