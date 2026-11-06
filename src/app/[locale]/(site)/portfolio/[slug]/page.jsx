import { permanentRedirect } from "next/navigation";
import portfolioData from "../../../../../data/portfolioData";
import { getDictionary } from "../../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../../i18n/metadata";
import ProjectPage from "../../../../../views/ProjectPage/ProjectPage";

export function generateStaticParams() {
  return portfolioData.map((item) => ({ slug: item.slug }));
}

const readSlug = (raw) => {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const { portfolio, seo } = getDictionary(locale);
  const project = portfolio.projects.find((item) => item.slug === readSlug(slug));

  if (!project) {
    return { ...seo.pages.projectNotFound, robots: { index: false } };
  }

  return pageMetadata(locale, `/portfolio/${encodeURIComponent(project.slug)}`, {
    title: project.title,
    description: project.description,
  });
}

export default async function Page({ params }) {
  const { locale, slug } = await params;
  const decoded = readSlug(slug);

  const renamed = portfolioData.find((item) => item.oldSlugs?.includes(decoded));
  if (renamed) permanentRedirect(`/${locale}/portfolio/${renamed.slug}`);

  return <ProjectPage slug={decoded} />;
}
