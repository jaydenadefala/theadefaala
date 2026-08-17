import type { Metadata } from "next";
import Link from "next/link";
import Scene from "@/components/three/Scene";
import WritingGalleryScene from "@/components/three/writing/WritingGalleryScene";
import WritingGalleryFallback from "./WritingGalleryFallback";
import { getWritingPieces } from "@/lib/payload/writing";
import { getSiteSettings } from "@/lib/payload/settings";
import { buildMetadata } from "@/lib/seo";
import { pickFeatured } from "@/lib/payload/featured";
import styles from "./writing.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const pieces = await getWritingPieces();
  return buildMetadata({
    title: "Writing — theAdefala",
    description:
      "Essays, reflections, and poems by theAdefala — a working archive, not a highlight reel.",
    path: "/writing",
    image: pickFeatured(pieces)?.coverImage,
  });
}

export const revalidate = 60;

export default async function WritingPage() {
  const [pieces, { siteTitle }] = await Promise.all([
    getWritingPieces(),
    getSiteSettings(),
  ]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          {siteTitle}
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
          fallback={<WritingGalleryFallback pieces={pieces} />}
        >
          <WritingGalleryScene pieces={pieces} />
        </Scene>
      </div>
    </main>
  );
}
