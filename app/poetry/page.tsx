import type { Metadata } from "next";
import Link from "next/link";
import styles from "./poetry.module.css";

export const metadata: Metadata = {
  title: "Poetry — theAdefala",
  description: "A slower room. Poems by theAdefala, published as they're ready.",
};

const PIECES = [
  "Untitled (for the version of me that almost quit)",
  "What the pulpit taught me about pull requests",
  "Sunday, unfinished",
];

export default function PoetryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          theAdefala
        </Link>
        <Link href="/#poetry" className={styles.back}>
          ← Back to the story
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Poetry</span>
        <h1 className={styles.title}>
          A slower room, kept mostly quiet.
        </h1>
      </section>

      <section className={styles.list} aria-label="Poems">
        {PIECES.map((title) => (
          <article key={title} className={styles.piece}>
            <span className={styles.pieceStatus}>Coming soon</span>
            <h2 className={styles.pieceTitle}>{title}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
