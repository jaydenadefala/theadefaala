import type { Metadata } from "next";
import Link from "next/link";
import DevSystemGrid from "@/components/DevSystemGrid";
import { getDevelopmentProjects, getProjectsByCategory } from "@/lib/payload/development";
import { buildMetadata } from "@/lib/seo";
import { pickFeatured } from "@/lib/payload/featured";
import styles from "./development.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getDevelopmentProjects();
  return buildMetadata({
    title: "Development — theAdefala",
    description:
      "Web and business systems by theAdefala — what's built, how it's built, and why it matters.",
    path: "/development",
    image: pickFeatured(projects)?.coverImage,
  });
}

const PRINCIPLES = [
  "Start from the constraint, not the template.",
  "A system should be legible to the next person who touches it.",
  "Performance is a feature, not an afterthought.",
  "Ship the smallest true version, then earn the next layer.",
];

export const revalidate = 60;

export default async function DevelopmentPage() {
  const [webProjects, businessProjects] = await Promise.all([
    getProjectsByCategory("Web"),
    getProjectsByCategory("Business"),
  ]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/#development" className={styles.back}>
          ← Back to the story
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Development</span>
        <h1 className={styles.title}>How it gets built.</h1>
        <p className={styles.intro}>
          Two tracks, one way of thinking: understand the actual problem
          before touching a keyboard, then build the smallest thing that
          solves it well.
        </p>
      </section>

      <div className={styles.systems}>
        <DevSystemGrid label="Web" projects={webProjects} />
        <DevSystemGrid label="Business" projects={businessProjects} />
      </div>

      <section className={styles.principles} aria-label="How I build">
        <span className={styles.principlesTitle}>How I build</span>
        <ul className={styles.principlesList}>
          {PRINCIPLES.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
