import { notFound } from "next/navigation";
import { ProfessionalProfilePage } from "../../../components/site/ProfessionalProfilePage";
import { getProfessionalBySlug, professionals } from "../../../components/site/data";

export function generateStaticParams() {
  return professionals.map((professional) => ({
    slug: professional.slug,
  }));
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
