import portfolioData from "../../../../data/portfolioData";
import ProjectPage from "../../../../views/ProjectPage/ProjectPage";

/**
 * Слаги берём из локальных данных портфолио — источник тот же, что у страницы.
 * dynamicParams остаётся включённым: неизвестный слаг ProjectPage показывает
 * собственным экраном «project not found», как и раньше.
 */
export function generateStaticParams() {
  return portfolioData.map((item) => ({ slug: item.slug }));
}

// Слаги содержат пробелы ("Impera Design"), поэтому в URL они приезжают
// percent-encoded. Раскодируем один раз и по-доброму.
const readSlug = (raw) => {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = portfolioData.find((item) => item.slug === readSlug(slug));

  if (!project) {
    return {
      title: "Project not found",
      description: "This case has not landed in the portfolio yet.",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <ProjectPage slug={readSlug(slug)} />;
}
