import type { Metadata } from "next";
import Link from "next/link";
import Scene from "@/components/three/Scene";
import PoetryGalleryScene from "@/components/three/poetry/PoetryGalleryScene";
import PoetryGalleryFallback from "./PoetryGalleryFallback";
import { getPoems } from "@/lib/payload/poems";
import styles from "./poetry.module.css";

export const metadata: Metadata = {
  title: "Poetry — theAdefala",
  description: "A slower room. Poems by theAdefala, published as they're ready.",
};

export const revalidate = 60;

export default async function PoetryPage() {
  const poems = await getPoems();

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
        <h1 className={styles.title}>A slower room, kept mostly quiet.</h1>
      </section>

      <div className={styles.galleryHost}>
        <Scene
          className={styles.canvasHost}
          fallback={<PoetryGalleryFallback poems={poems} />}
        >
          <PoetryGalleryScene poems={poems} />
        </Scene>
      </div>
    </main>
  );
}
