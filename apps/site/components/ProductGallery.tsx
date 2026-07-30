"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ProductGallery({
  imagens,
  imagemLegada,
  nome,
}: {
  imagens: string[];
  imagemLegada: string | null;
  nome: string;
}) {
  const fotos = imagens.length > 0 ? imagens : imagemLegada ? [imagemLegada] : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  function irPara(index: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.clientWidth, behavior: "smooth" });
    setIndiceAtivo(index);
  }

  function handleScroll() {
    const container = containerRef.current;
    if (!container || container.clientWidth === 0) return;
    setIndiceAtivo(Math.round(container.scrollLeft / container.clientWidth));
  }

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full rounded-lg bg-aurum-emerald/30">
        <Image
          src="/logo-oficial.png"
          alt=""
          fill
          className="object-contain p-16 opacity-10 mix-blend-screen"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-aurum-ice/[0.04] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((url, index) => (
          <div key={url} className="relative aspect-[4/5] w-full flex-none snap-center">
            <Image
              src={url}
              alt={`${nome} — foto ${index + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={index === 0}
              className="object-contain p-8"
            />
          </div>
        ))}
      </div>

      {fotos.length > 1 && (
        <div className="flex justify-center gap-2">
          {fotos.map((url, index) => (
            <button
              key={url}
              type="button"
              aria-label={`Ver foto ${index + 1}`}
              onClick={() => irPara(index)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === indiceAtivo ? "bg-aurum-gold" : "bg-aurum-ice/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
