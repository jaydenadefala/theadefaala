"use client";

import SceneObject from "@/components/three/SceneObject";
import { useChapterTransition } from "@/lib/motion/useChapterTransition";
import { makeCardCoverTexture } from "@/lib/three/makeCardCoverTexture";
import { useImageTexture } from "@/lib/three/useImageTexture";
import { makeRoundedRectMask } from "@/lib/three/makeRoundedRectMask";
import type { WritingPiece } from "@/content/writing";
import styles from "./WritingCard.module.css";

interface WritingCardProps {
  piece: WritingPiece;
  basePosition: readonly [number, number, number];
  baseRotationY: number;
  isSelf: boolean;
  isDimmed: boolean;
  onHover: (slug: string | null) => void;
}

const WIDTH = 1.5;
const HEIGHT = WIDTH / (3 / 4);

export default function WritingCard({
  piece,
  basePosition,
  baseRotationY,
  isSelf,
  isDimmed,
  onHover,
}: WritingCardProps) {
  const href = `/writing/${piece.slug}`;
  const handleClick = useChapterTransition(href);
  // Real uploaded cover wins when present; the procedural accent
  // gradient is the fallback for pieces that don't have one yet, not
  // a placeholder waiting to be replaced by fabricated art.
  const imageTexture = useImageTexture(piece.coverImage, WIDTH / HEIGHT);
  const gradientTexture = makeCardCoverTexture(piece.accent);
  const texture = imageTexture ?? gradientTexture;
  const mask = makeRoundedRectMask(0.1);

  return (
    <SceneObject
      basePosition={basePosition}
      baseRotationY={baseRotationY}
      width={WIDTH}
      height={HEIGHT}
      texture={texture}
      mask={mask}
      isFocused={isSelf}
      isDimmed={isDimmed}
      focusTransform={{
        x: -basePosition[0] * 0.45,
        y: 0,
        z: 1.6,
        scale: 1.25,
        rotationY: -baseRotationY,
      }}
      labelPosition={[0, -HEIGHT / 2 - 0.35, 0]}
      onMeshHover={(hovered) => onHover(hovered ? piece.slug : null)}
      label={
        <a
          href={href}
          className={`${styles.label} ${isSelf ? styles.active : ""}`}
          onClick={handleClick}
          onPointerOver={() => onHover(piece.slug)}
          onPointerOut={() => onHover(null)}
        >
          <span className={styles.kind}>{piece.category}</span>
          <span className={styles.title}>{piece.title}</span>
        </a>
      }
    />
  );
}
