import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PREACHER_MESSAGES,
  getMessage,
  getAdjacentMessages,
} from "@/content/preacher";
import AudioPlayer from "@/components/AudioPlayer";
import styles from "./preacher-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PREACHER_MESSAGES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const message = getMessage(slug);
  if (!message) return {};
  return {
    title: `${message.title} — theAdefala`,
    description: message.excerpt,
  };
}

export default async function PreacherDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const message = getMessage(slug);
  if (!message) notFound();

  const { prev, next } = getAdjacentMessages(slug);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/preacher" className={styles.back}>
          ← Back to preacher
        </Link>
      </header>

      <article>
        <div className={styles.hero}>
          <span className={styles.category}>{message.category}</span>
          <h1 className={styles.title}>{message.title}</h1>
          {message.scripture && (
            <p className={styles.scripture}>{message.scripture}</p>
          )}
          <p className={styles.excerpt}>{message.excerpt}</p>
        </div>

        {message.status === "published" && message.body.length > 0 ? (
          <div className={styles.body}>
            {message.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className={styles.draftNotice}>
            <span className={styles.draftLabel}>Coming soon</span>
            <p className={styles.draftText}>
              This message isn&rsquo;t written or recorded yet — the page
              exists so it has a real home the moment it is.
            </p>
          </div>
        )}

        {message.audioSrc !== undefined && (
          <div className={styles.player}>
            <AudioPlayer src={message.audioSrc} title={message.title} />
          </div>
        )}
      </article>

      {(prev || next) && (
        <nav className={styles.nav} aria-label="More messages">
          {prev ? (
            <Link href={`/preacher/${prev.slug}`} className={styles.navLink}>
              <span className={styles.navLabel}>← Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/preacher/${next.slug}`} className={styles.navLink}>
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
