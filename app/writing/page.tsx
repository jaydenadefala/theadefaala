import type { Metadata } from "next";
import Link from "next/link";
import styles from "./writing.module.css";

export const metadata: Metadata = {
  title: "Writing — theAdefala",
  description:
    "Essays, reflections, and poems by theAdefala — a working archive, not a highlight reel.",
};

const PIECES = [
  {
    title: "On building in the dark before anyone is watching",
    kind: "Essay",
    status: "Coming soon",
  },
  {
    title: "A short list of things I no longer apologize for",
    kind: "Reflection",
    status: "Coming soon",
  },
  {
    title: "Untitled (for the version of me that almost quit)",
    kind: "Poem",
    status: "Coming soon",
  },
];

export default function WritingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/#writing" className={styles.back}>
          ← Back to the story
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Writing</span>
        <h1 className={styles.title}>The real thing.</h1>
        <p className={styles.intro}>
          This is the archive behind the teaser — essays, reflections, and
          poems, published as they&rsquo;re ready. No filler, no engagement
          bait. Pieces are being migrated here now; check back soon for the
          first full read.
        </p>
      </section>

      <section className={styles.list} aria-label="Selected writing">
        {PIECES.map((piece) => (
          <article key={piece.title} className={styles.piece}>
            <span className={styles.pieceKind}>{piece.kind}</span>
            <h2 className={styles.pieceTitle}>{piece.title}</h2>
            <span className={styles.pieceStatus}>{piece.status}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
