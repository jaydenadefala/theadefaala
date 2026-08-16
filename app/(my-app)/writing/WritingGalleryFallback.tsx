import Link from "next/link";
import type { WritingPiece } from "@/content/writing";
import styles from "./WritingGalleryFallback.module.css";

interface WritingGalleryFallbackProps {
  pieces: WritingPiece[];
}

/**
 * Plain DOM/CSS list — the Scene fallback for no-WebGL devices and
 * prefers-reduced-motion. Same data (passed down from the page's one
 * fetch) as the 3D gallery, so the two views can never drift out of
 * sync with each other.
 */
export default function WritingGalleryFallback({
  pieces,
}: WritingGalleryFallbackProps) {
  const sorted = [...pieces].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className={styles.list} aria-label="Selected writing">
      {sorted.map((piece) => (
        <Link
          key={piece.slug}
          href={`/writing/${piece.slug}`}
          className={styles.piece}
        >
          <span className={styles.pieceThumb}>
            {piece.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={piece.coverImage} alt="" loading="lazy" />
            )}
          </span>
          <span className={styles.pieceKind}>{piece.category}</span>
          <h2 className={styles.pieceTitle}>{piece.title}</h2>
          <span className={styles.pieceStatus}>
            {piece.status === "published" ? "Read" : "Coming soon"}
          </span>
        </Link>
      ))}
    </section>
  );
}
