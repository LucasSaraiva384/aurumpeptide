/**
 * Marca d'água de molécula flat, linha fina, dourada — decorativa apenas
 * (não é o logo oficial). Segue docs/identidade-visual.md: opacidade baixa,
 * sem sombra, sem contorno duplo, sem 3D.
 */
export function MoleculeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      className={className}
    >
      <g stroke="currentColor" strokeWidth="0.6">
        <path d="M100 20 L165 57 L165 132 L100 169 L35 132 L35 57 Z" />
        <path d="M100 20 L100 169 M35 57 L165 132 M165 57 L35 132" />
      </g>
      <g fill="currentColor">
        <circle cx="100" cy="20" r="4" />
        <circle cx="165" cy="57" r="4" />
        <circle cx="165" cy="132" r="4" />
        <circle cx="100" cy="169" r="4" />
        <circle cx="35" cy="132" r="4" />
        <circle cx="35" cy="57" r="4" />
        <circle cx="100" cy="94.5" r="5" />
      </g>
    </svg>
  );
}
