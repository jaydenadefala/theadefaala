import type { Metadata } from "next";
import Link from "next/link";
import styles from "./development.module.css";

export const metadata: Metadata = {
  title: "Development — theAdefala",
  description:
    "Web and business systems by theAdefala — what's built, how it's built, and why it matters.",
};

const TRACKS = [
  {
    label: "Web",
    title: "Products, shipped.",
    body: "Interfaces and systems built end to end — architecture, state, motion, and the last 5% of polish most teams skip under deadline. I'd rather ship something smaller and correct than something large and shaky.",
  },
  {
    label: "Business",
    title: "The plumbing underneath.",
    body: "Ops tooling, automation, and decision-support systems — the unglamorous work that makes everything else possible. Good business systems are invisible when they work and expensive when they don't.",
  },
];

const PRINCIPLES = [
  "Start from the constraint, not the template.",
  "A system should be legible to the next person who touches it.",
  "Performance is a feature, not an afterthought.",
  "Ship the smallest true version, then earn the next layer.",
];

export default function DevelopmentPage() {
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

      <section className={styles.tracks} aria-label="Web and Business tracks">
        {TRACKS.map((track) => (
          <article key={track.label} className={styles.track}>
            <span className={styles.trackLabel}>{track.label}</span>
            <h2 className={styles.trackTitle}>{track.title}</h2>
            <p className={styles.trackBody}>{track.body}</p>
          </article>
        ))}
      </section>

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
