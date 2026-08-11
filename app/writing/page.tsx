import type { Metadata } from "next";
import Link from "next/link";
import Scene from "@/components/three/Scene";
import WritingGalleryScene from "@/components/three/writing/WritingGalleryScene";
import WritingGalleryFallback from "./WritingGalleryFallback";
import styles from "./writing.module.css";

export const metadata: Metadata = {
  title: "Writing — theAdefala",
  description:
    "Essays, reflections, and poems by theAdefala — a working archive, not a highlight reel.",
};

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

      <div className={styles.galleryHost}>
        <Scene
          className={styles.canvasHost}
          fallback={<WritingGalleryFallback />}
        >
          <WritingGalleryScene />
        </Scene>
      </div>
    </main>
  );
}
