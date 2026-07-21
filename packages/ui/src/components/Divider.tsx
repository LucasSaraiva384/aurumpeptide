/** Régua fina em degradê dourado — separa seções sem recorrer a bordas duras. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px bg-gradient-to-r from-transparent via-aurum-gold/40 to-transparent ${className}`}
    />
  );
}
