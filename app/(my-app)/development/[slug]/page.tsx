import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDevelopmentProjects,
  getProject,
  getAdjacentProjects,
} from "@/lib/payload/development";
import { getSiteSettings } from "@/lib/payload/settings";
import { buildMetadata } from "@/lib/seo";
import styles from "./development-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getDevelopmentProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: `${project.name} — theAdefala`,
    description: project.shortDescription,
    path: `/development/${slug}`,
    image: project.coverImage,
    type: "article",
  });
}

export default async function DevelopmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [{ prev, next }, { siteTitle }] = await Promise.all([
    getAdjacentProjects(slug),
    getSiteSettings(),
  ]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          {siteTitle}
        </Link>
        <Link href="/development" className={styles.back}>
          ← Back to development
        </Link>
      </header>

      <article>
        {project.coverImage && (
          <div className={styles.coverImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImage} alt="" />
          </div>
        )}

        <div className={styles.hero}>
          <span className={styles.category}>{project.category}</span>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.description}>{project.shortDescription}</p>
        </div>

        <div className={styles.meta}>
          <div>
            <span className={styles.metaLabel}>Role</span>
            <span className={styles.metaValue}>{project.role}</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Stack</span>
            <ul className={styles.tags}>
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
          {project.businessContext && (
            <div>
              <span className={styles.metaLabel}>Context</span>
              <span className={styles.metaValue}>
                {project.businessContext}
              </span>
            </div>
          )}
          {(project.externalUrl || project.githubUrl) && (
            <div>
              <span className={styles.metaLabel}>Links</span>
              <div className={styles.links}>
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {project.status === "published" && project.fullDescription ? (
          <p className={styles.description}>{project.fullDescription}</p>
        ) : (
          <div className={styles.draftNotice}>
            <span className={styles.draftLabel}>Case study coming soon</span>
            <p className={styles.draftText}>
              The full write-up for this one isn&rsquo;t published yet —
              this page exists so it has a real home the moment it is.
            </p>
          </div>
        )}

        {project.images.length > 0 && (
          <div className={styles.gallery}>
            {project.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src + i} src={src} alt="" loading="lazy" />
            ))}
          </div>
        )}
      </article>

      {(prev || next) && (
        <nav className={styles.nav} aria-label="More projects">
          {prev ? (
            <Link
              href={`/development/${prev.slug}`}
              className={styles.navLink}
            >
              <span className={styles.navLabel}>← Previous</span>
              <span className={styles.navTitle}>{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/development/${next.slug}`}
              className={styles.navLink}
            >
              <span className={styles.navLabel}>Next →</span>
              <span className={styles.navTitle}>{next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
