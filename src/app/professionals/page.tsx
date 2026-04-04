import { ProfessionalsPageContent } from "../../components/site/ProfessionalsPageContent";

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
