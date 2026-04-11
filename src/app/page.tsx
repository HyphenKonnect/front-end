import { HomePageContent } from "../components/site/HomePageContent";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Online Therapy, Doctor Consultation, Legal Guidance & Wellness Support",
  description:
    "Book online support with therapists, doctors, legal advisors, and wellness experts on The Hyphen Konnect. Find trusted care for trauma, stress, health, legal, and lifestyle needs.",
  path: "/",
  keywords: [
    "online therapy platform",
    "online counselling booking",
    "doctor consultation booking",
    "legal consultation platform",
    "holistic support services",
    "trauma support India",
  ],
});

export default function Home() {
  return <HomePageContent />;
}
