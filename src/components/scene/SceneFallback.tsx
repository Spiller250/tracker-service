/**
 * Lightweight, WebGL-free version of the hero scene (SVG + CSS).
 * Used while the 3D chunk loads, when WebGL is unavailable, or after a WebGL error.
 * The van only moves when `animate` is true (never for reduced-motion users).
 */
export default function SceneFallback({ animate = false }: { animate?: boolean }) {
  const route = "M 90 190 C 90 120, 210 90, 300 90 S 510 120, 510 190 S 390 290, 300 290 S 90 260, 90 190 Z";
  return (
    <svg
      className="scene-fallback"
      viewBox="0 -30 600 440"
      role="img"
      aria-label="Схема маршрута: склад в Китае и распределительный центр в Казахстане, соединённые дорогой с фургоном"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse cx="300" cy="200" rx="270" ry="150" fill="#F7DCDF" />
      <ellipse cx="300" cy="196" rx="255" ry="138" fill="#FFF4F1" />
      <path d={route} fill="none" stroke="#4B3F42" strokeWidth="34" strokeLinejoin="round" />
      <path d={route} fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="10 12" />

      {/* China warehouse */}
      <g transform="translate(150 118)">
        <rect x="0" y="34" width="86" height="46" fill="#fff" />
        <rect x="0" y="52" width="86" height="6" fill="#D40511" />
        <path d="M-8 36 L43 6 L94 36 Z" fill="#900B18" />
        <rect x="30" y="58" width="26" height="22" fill="#2A2326" />
      </g>
      {/* Kazakhstan hub */}
      <g transform="translate(364 124)">
        <rect x="0" y="40" width="86" height="40" fill="#fff" />
        <rect x="0" y="52" width="86" height="5" fill="#D40511" />
        <path d="M44 40 A28 28 0 0 1 100 40 Z" transform="translate(-12 -4)" fill="#7DB8D6" />
        <rect x="8" y="58" width="16" height="22" fill="#2A2326" />
      </g>

      {/* van */}
      <g className={animate ? "van-anim" : undefined} style={animate ? undefined : { transform: "translate(300px, 290px)" }}>
        <g transform="translate(-18 -20)">
          <rect x="0" y="4" width="26" height="20" rx="2" fill="#D40511" />
          <rect x="26" y="10" width="14" height="14" rx="2" fill="#E32936" />
          <rect x="31" y="12" width="7" height="6" fill="#2A2326" />
          <circle cx="9" cy="26" r="4.5" fill="#2B2427" />
          <circle cx="32" cy="26" r="4.5" fill="#2B2427" />
        </g>
      </g>

      <text x="193" y="226" textAnchor="middle" className="scene-svg-label">КИТАЙ</text>
      <text x="407" y="226" textAnchor="middle" className="scene-svg-label">КАЗАХСТАН</text>
    </svg>
  );
}
