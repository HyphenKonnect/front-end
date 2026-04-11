import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfessionalProfilePage } from "../../../components/site/ProfessionalProfilePage";
import { getProfessionalBySlug, professionals } from "../../../components/site/data";
import { buildPageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return professionals.map((professional) => ({
    slug: professional.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/professionals/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const professional = getProfessionalBySlug(params.slug);

  if (!professional) {
    return buildPageMetadata({
      title: "Professional Profile",
      description: "Browse trusted professionals on The Hyphen Konnect.",
      path: "/professionals",
    });
  }

  return buildPageMetadata({
    title: `${professional.name} - ${professional.specialty}`,
    description: `View ${professional.name}, ${professional.specialty} at The Hyphen Konnect. Explore expertise, languages, availability, and booking options for online support.`,
    path: `/professionals/${professional.slug}`,
    keywords: [
      professional.name,
      professional.specialty,
      professional.location,
      ...professional.expertise,
      ...professional.languages,
      `${professional.specialty} online`,
    ],
  });
}

export default async function ProfessionalDetailPage(
  props: PageProps<"/professionals/[slug]">,
) {
  const params = await props.params;
  const professional = getProfessionalBySlug(params.slug);

  if (!professional) {
    notFound();
  }

  const relatedProfessionals = professionals
    .filter(
      (item) =>
        item.slug !== professional.slug &&
        (item.category === professional.category || item.category === "all"),
    )
    .slice(0, 3);

  return (
    <ProfessionalProfilePage
      professional={professional}
      relatedProfessionals={relatedProfessionals}
    />
  );
}
