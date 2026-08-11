import Link from "next/link";
import { POEMS, MOOD_STYLES } from "@/content/poetry";
import styles from "./PoetryGalleryFallback.module.css";

/**
 * Native horizontal scroll-snap — the cheap, robust CSS equivalent of
 * the WebGL corridor, and exactly what the brief calls for on mobile
 * even in the 3D-capable case ("horizontal swipe/snap"). Here it's the
 * Scene fallback for no-WebGL/reduced-motion.
 */
export default function PoetryGalleryFallback() {
  const sorted = [...POEMS].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className={styles.track}>
      {sorted.map((piece) => {
        const mood = MOOD_STYLES[piece.mood];
        return (
          <Link
            key={piece.slug}
            href={`/poetry/${piece.slug}`}
            className={styles.card}
          >
            <div
              className={styles.cover}
              style={{
                background: `linear-gradient(155deg, ${mood.accent}, ${mood.background})`,
              }}
              aria-hidden="true"
            />
            <span className={styles.title}>{piece.title}</span>
            <span className={styles.excerpt}>{piece.excerpt}</span>
          </Link>
        );
      })}
    </div>
  );
}
