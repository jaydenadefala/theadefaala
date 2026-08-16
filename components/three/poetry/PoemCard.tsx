"use client";

import SceneObject from "@/components/three/SceneObject";
import { useChapterTransition } from "@/lib/motion/useChapterTransition";
import { makeCardCoverTexture } from "@/lib/three/makeCardCoverTexture";
import { useImageTexture } from "@/lib/three/useImageTexture";
import { makeRoundedRectMask } from "@/lib/three/makeRoundedRectMask";
import type { PoemPiece, MoodStyle } from "@/content/poetry";
import styles from "./PoemCard.module.css";

interface PoemCardProps {
  piece: PoemPiece;
  mood: MoodStyle;
  slotX: number;
  isActive: boolean;
}

const WIDTH = 2.6;
const HEIGHT = WIDTH * 0.62;

export default function PoemCard({ piece, mood, slotX, isActive }: PoemCardProps) {
  const href = `/poetry/${piece.slug}`;
  const handleClick = useChapterTransition(href);
  // Real uploaded cover wins when present; the mood-color gradient is
  // the fallback for poems that don't have one yet.
  const imageTexture = useImageTexture(piece.coverImage, WIDTH / HEIGHT);
  const gradientTexture = makeCardCoverTexture(mood.accent);
  const texture = imageTexture ?? gradientTexture;
  const mask = makeRoundedRectMask(0.06);

  return (
    <SceneObject
      basePosition={[slotX, 0, 0]}
      width={WIDTH}
      height={HEIGHT}
      texture={texture}
      mask={mask}
      isFocused={isActive}
      // Poetry has no neutral state — exactly one poem is ever active,
      // every other card is dimmed. It also keeps drifting regardless
      // (alwaysIdle), matching the original "corridor at rest" feel,
      // and idles slower/quieter than Writing per the mood system.
      isDimmed={!isActive}
      dimRecede={-0.5}
      focusTransform={{ z: 1.1, scale: 1.15 }}
      idleSpeed={0.22}
      idleAmplitude={0.04}
      alwaysIdle
      focusDuration={mood.motionScale * 0.7}
      opacityDuration={mood.motionScale * 0.7}
      labelPosition={[0, -HEIGHT / 2 - 0.5, 0]}
      onMeshHover={() => {}}
      label={
        <a
          href={href}
          className={`${styles.label} ${isActive ? styles.active : ""}`}
          onClick={handleClick}
        >
          <span className={styles.title}>{piece.title}</span>
          <span className={styles.excerpt}>{piece.excerpt}</span>
        </a>
      }
    />
  );
}
