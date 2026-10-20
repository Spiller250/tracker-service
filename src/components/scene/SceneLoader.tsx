"use client";

import dynamic from "next/dynamic";
import SceneFallback from "./SceneFallback";

/** Client-only, code-split entry point for the 3D hero scene. */
const ChinaKazakhstanScene = dynamic(() => import("./ChinaKazakhstanScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-box">
      <div className="scene-under">
        <SceneFallback />
      </div>
    </div>
  ),
});

export default function SceneLoader() {
  return <ChinaKazakhstanScene />;
}
