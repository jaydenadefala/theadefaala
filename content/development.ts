/**
 * Local content source for Development projects — same disclosed
 * pattern as content/writing.ts and content/poetry.ts. Field list
 * matches the CMS shape from the brief (role, technologies, external/
 * GitHub links, business context) so Milestone 10/11 can swap this for
 * a database without touching any component.
 *
 * No fabricated case studies: every project is honestly
 * status:"draft" with a generic, structural description rather than
 * invented client names, metrics, or outcomes.
 */

export type ProjectCategory = "Web" | "Business";
export type ContentStatus = "draft" | "published";

export interface DevelopmentProject {
  slug: string;
  name: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  role: string;
  technologies: string[];
  externalUrl: string | null;
  githubUrl: string | null;
  businessContext: string | null;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export const DEVELOPMENT_PROJECTS: DevelopmentProject[] = [
  {
    slug: "product-interface-system",
    name: "Product interface system",
    category: "Web",
    shortDescription:
      "A design-system-first approach to product UI — tokens before components, components before pages.",
    fullDescription: "",
    role: "Design & engineering",
    technologies: ["Next.js", "TypeScript", "Design tokens"],
    externalUrl: null,
    githubUrl: null,
    businessContext: null,
    featured: true,
    displayOrder: 0,
    status: "draft",
  },
  {
    slug: "motion-driven-interactions",
    name: "Motion-driven interactions",
    category: "Web",
    shortDescription:
      "Interfaces where the animation carries meaning, not decoration bolted on after the fact.",
    fullDescription: "",
    role: "Frontend engineering",
    technologies: ["React", "GSAP", "WebGL"],
    externalUrl: null,
    githubUrl: null,
    businessContext: null,
    featured: false,
    displayOrder: 1,
    status: "draft",
  },
  {
    slug: "ops-automation-layer",
    name: "Ops automation layer",
    category: "Business",
    shortDescription:
      "Replacing a spreadsheet-and-memory workflow with a system that doesn't forget.",
    fullDescription: "",
    role: "Systems design",
    technologies: ["Automation", "Internal tooling"],
    externalUrl: null,
    githubUrl: null,
    businessContext:
      "Built for a process that had outgrown manual tracking.",
    featured: false,
    displayOrder: 2,
    status: "draft",
  },
  {
    slug: "decision-support-tooling",
    name: "Decision-support tooling",
    category: "Business",
    shortDescription:
      "Turning scattered numbers into a system people actually check before deciding.",
    fullDescription: "",
    role: "Product & systems design",
    technologies: ["Data pipelines", "Dashboards"],
    externalUrl: null,
    githubUrl: null,
    businessContext: "Built to make a recurring decision faster and safer.",
    featured: false,
    displayOrder: 3,
    status: "draft",
  },
];

export function getProject(slug: string): DevelopmentProject | undefined {
  return DEVELOPMENT_PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory) {
  return DEVELOPMENT_PROJECTS.filter((p) => p.category === category).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}

export function getAdjacentProjects(slug: string) {
  const sorted = [...DEVELOPMENT_PROJECTS].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sorted[(index - 1 + sorted.length) % sorted.length],
    next: sorted[(index + 1) % sorted.length],
  };
}
