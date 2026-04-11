import { ProfessionalsPageContent } from "../../components/site/ProfessionalsPageContent";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Find Therapists, Doctors, Legal Advisors and Wellness Experts",
  description:
    "Browse verified therapists, doctors, legal advisors, and wellness coaches on The Hyphen Konnect and find the right professional for your needs.",
  path: "/professionals",
  keywords: [
    "find therapists India",
    "find doctors online India",
    "find legal advisors India",
    "find wellness coaches India",
    "verified professionals platform",
  ],
});

export default async function ProfessionalsPage(
  props: PageProps<"/professionals">,
) {
  const searchParams = await props.searchParams;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : "all";

  return <ProfessionalsPageContent initialCategory={category} />;
}
