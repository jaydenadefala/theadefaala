import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOOD_STYLES } from "@/content/poetry";
import { getPoems, getPoem, getAdjacentPoems } from "@/lib/payload/poems";
import AudioPlayer from "@/components/AudioPlayer";
import styles from "./poetry-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const poems = await getPoems();
  return poems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPoem(slug);
  if (!poem) return {};
  return {
    title: `${poem.title} — theAdefala`,
    description: poem.excerpt,
  };
}

export default async function PoemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const poem = await getPoem(slug);
  if (!poem) notFound();

  const mood = MOOD_STYLES[poem.mood];
  const { prev, next } = await getAdjacentPoems(slug);

  return (
    <main
      className={styles.page}
      style={{ background: mood.background }}
    >
      {poem.backgroundImage && (
        <div
          className={styles.ambientImage}
          style={{ backgroundImage: `url(${poem.backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      <div
        className={styles.ambient}
        style={{
          background: `radial-gradient(60% 55% at 50% 30%, ${mood.accent}33 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/poetry" className={styles.back}>
          ← Back to poetry
        </Link>
      </header>

      <section className={styles.main}>
        <span className={styles.mood}>{poem.mood}</span>
        <h1 className={styles.title}>{poem.title}</h1>

        {poem.status === "published" && poem.lines.length > 0 ? (
          <p className={styles.poem}>
            {poem.lines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        ) : (
          <div className={styles.draftNotice}>
            <span className={styles.draftLabel}>Coming soon</span>
            <p className={styles.draftText}>{poem.excerpt}</p>
          </div>
        )}

        <div className={styles.player}>
          <AudioPlayer src={poem.audioSrc} title={poem.title} />
        </div>
      </section>

      {(prev || next) && (
        <nav className={styles.nav} aria-label="More poems">
          {prev ? (
            <Link href={`/poetry/${prev.slug}`} className={styles.navLink}>
              <span className={styles.navLabel}>← Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/poetry/${next.slug}`} className={styles.navLink}>
              <span className={styles.navLabel}>Next →</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
