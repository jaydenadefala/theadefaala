import { getPayloadClient } from "./getPayloadClient";
import { serializeRichTextToParagraphs } from "./serializeRichText";
import type { DevelopmentProject, ProjectCategory } from "@/content/development";
import type { DevelopmentProject as DevelopmentProjectDoc } from "@/payload-types";

function toDomain(doc: DevelopmentProjectDoc): DevelopmentProject {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    shortDescription: doc.shortDescription,
    fullDescription: serializeRichTextToParagraphs(doc.fullDescription).join("\n\n"),
    role: doc.role,
    technologies: (doc.technologies ?? []).map((t) => t.value),
    externalUrl: doc.externalUrl ?? null,
    githubUrl: doc.githubUrl ?? null,
    businessContext: doc.businessContext ?? null,
    featured: doc.featured ?? false,
    displayOrder: doc.displayOrder ?? 0,
    status: doc._status === "published" ? "published" : "draft",
  };
}

export async function getDevelopmentProjects(): Promise<DevelopmentProject[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "development-projects",
    sort: "displayOrder",
    limit: 100,
  });
  return result.docs.map(toDomain);
}

export async function getProjectsByCategory(
  category: ProjectCategory
): Promise<DevelopmentProject[]> {
  const projects = await getDevelopmentProjects();
  return projects
    .filter((p) => p.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProject(
  slug: string
): Promise<DevelopmentProject | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "development-projects",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? toDomain(doc) : undefined;
}

export async function getAdjacentProjects(slug: string) {
  const projects = await getDevelopmentProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
