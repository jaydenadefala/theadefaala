import Link from "next/link";
import { MOOD_STYLES, type PoemPiece } from "@/content/poetry";
import styles from "./PoetryGalleryFallback.module.css";

interface PoetryGalleryFallbackProps {
  poems: PoemPiece[];
}

/**
 * Native horizontal scroll-snap — the cheap, robust CSS equivalent of
 * the WebGL corridor, and exactly what the brief calls for on mobile
 * even in the 3D-capable case ("horizontal swipe/snap"). Here it's the
 * Scene fallback for no-WebGL/reduced-motion.
 */
export default function PoetryGalleryFallback({ poems }: PoetryGalleryFallbackProps) {
  const sorted = [...poems].sort((a, b) => a.displayOrder - b.displayOrder);

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
            >
              {piece.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={piece.coverImage}
                  alt=""
                  className={styles.coverImg}
                  loading="lazy"
                />
              )}
            </div>
            <span className={styles.title}>{piece.title}</span>
            <span className={styles.excerpt}>{piece.excerpt}</span>
          </Link>
        );
      })}
    </div>
  );
}
