import Scene from "@/components/three/Scene";
import OpeningSceneR3F from "@/components/three/opening/OpeningSceneR3F";
import OpeningSceneFallback from "./OpeningSceneFallback";
import { DEFAULT_NAME, DEFAULT_ROLES } from "./IdentityOverlay";
import styles from "./OpeningScene.module.css";

interface OpeningSceneProps {
  name?: string;
  roles?: string[];
}

/**
 * Real WebGL spatial reveal on capable devices; the original DOM/CSS
 * sequence (untouched) for everyone else — no-WebGL, and
 * prefers-reduced-motion. See lib/three/Scene for the capability gate.
 */
export default function OpeningScene({
  name = DEFAULT_NAME,
  roles = DEFAULT_ROLES,
}: OpeningSceneProps) {
  return (
    <Scene
      className={styles.canvasHost}
      fallback={<OpeningSceneFallback name={name} roles={roles} />}
    >
      <OpeningSceneR3F name={name} roles={roles} />
    </Scene>
  );
}
