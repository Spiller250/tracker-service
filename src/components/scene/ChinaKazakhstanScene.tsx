"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import SceneCanvas from "./SceneCanvas";
import SceneFallback from "./SceneFallback";

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Hero 3D scene: red delivery van looping between a Chinese warehouse and a Kazakhstan hub.
 * Falls back to an SVG version without WebGL, and renders a still frame for reduced motion.
 */
export default function ChinaKazakhstanScene() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMode(webglAvailable() ? "webgl" : "fallback");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fail = () => setMode("fallback");

  return (
    <div ref={box} className="scene-box" data-ready={ready && mode === "webgl"}>
      <div className="scene-under" aria-hidden={mode === "webgl" && ready}>
        <SceneFallback animate={mode === "fallback" && !reduced} />
      </div>
      {mode === "webgl" && (
        <div className="scene-canvas" role="img" aria-label="Трёхмерная сцена: красный фургон курсирует между складом в Китае и центром в Казахстане">
          <Boundary onError={fail}>
            <SceneCanvas animate={!reduced} visible={visible} onReady={() => setReady(true)} onFail={fail} />
          </Boundary>
        </div>
      )}
    </div>
  );
}
