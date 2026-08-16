import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getWritingPieces,
  getWritingPiece,
  getAdjacentWritingPieces,
} from "@/lib/payload/writing";
import styles from "./writing-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const pieces = await getWritingPieces();
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getWritingPiece(slug);
  if (!piece) return {};
  return {
    title: `${piece.title} — theAdefala`,
    description: piece.excerpt,
  };
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const piece = await getWritingPiece(slug);
  if (!piece) notFound();

  const { prev, next } = await getAdjacentWritingPieces(slug);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/writing" className={styles.back}>
          ← Back to writing
        </Link>
      </header>

      <div
        className={styles.cover}
        style={
          piece.coverImage
            ? {
                // A var() reference can't have an alpha suffix glued
                // onto it (`var(--bg-soft)66` is invalid CSS and
                // silently drops the whole background-image value) —
                // rgba() against --bg-soft's actual color instead.
                backgroundImage: `linear-gradient(155deg, ${piece.accent}22, rgba(15, 17, 19, 0.4)), url(${piece.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(155deg, ${piece.accent}, var(--bg-soft))`,
              }
        }
        aria-hidden="true"
      />

      <article>
        <div className={styles.hero}>
          <span className={styles.kicker}>
            <span>{piece.category}</span>
          </span>
          <h1 className={styles.title}>{piece.title}</h1>
          {piece.subtitle && (
            <p className={styles.subtitle}>{piece.subtitle}</p>
          )}
          <p className={styles.excerpt}>{piece.excerpt}</p>
        </div>

        {piece.status === "published" && piece.body.length > 0 ? (
          <div className={styles.body}>
            {piece.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className={styles.draftNotice}>
            <span className={styles.draftLabel}>Coming soon</span>
            <p className={styles.draftText}>
              This piece isn&rsquo;t written yet — the page exists so the
              archive has a real, permanent home for it the moment it is.
              Check back soon, or{" "}
              <Link href="/connect" style={{ color: "var(--fg)" }}>
                say hello
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        )}
      </article>

      {(prev || next) && (
        <nav className={styles.nav} aria-label="More writing">
          {prev ? (
            <Link href={`/writing/${prev.slug}`} className={styles.navLink}>
              <span className={styles.navLabel}>← Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/writing/${next.slug}`} className={styles.navLink}>
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
