import Scene from "@/components/three/Scene";
import OpeningSceneR3F from "@/components/three/opening/OpeningSceneR3F";
import OpeningSceneFallback from "./OpeningSceneFallback";
import styles from "./OpeningScene.module.css";

/**
 * Real WebGL spatial reveal on capable devices; the original DOM/CSS
 * sequence (untouched) for everyone else — no-WebGL, and
 * prefers-reduced-motion. See lib/three/Scene for the capability gate.
 */
export default function OpeningScene() {
  return (
    <Scene className={styles.canvasHost} fallback={<OpeningSceneFallback />}>
      <OpeningSceneR3F />
    </Scene>
  );
}
