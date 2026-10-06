import Link from "next/link";

type Opcao = { id: string; rotulo: string; href: string };

/**
 * Seletor de variante (ex.: Dosagem 120mg / 160mg) na página de produto.
 * Cada opção é um link para a página da variante irmã — preço, imagens,
 * descrição, CTA de WhatsApp e canonical são sempre os da página atual,
 * então nada de estado no cliente. `replace`/`scroll={false}` deixam a
 * troca com cara de seleção, não de navegação.
 */
export function VarianteSelector({ rotulo, atualId, opcoes }: { rotulo: string; atualId: string; opcoes: Opcao[] }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-[0.25em] text-aurum-ice/60">{rotulo}</span>
      <div role="radiogroup" aria-label={rotulo} className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const ativa = opcao.id === atualId;
          return ativa ? (
            <span
              key={opcao.id}
              role="radio"
              aria-checked="true"
              className="min-w-20 rounded-full border border-aurum-gold bg-aurum-gold px-5 py-2 text-center text-sm font-medium text-aurum-green-deep"
            >
              {opcao.rotulo}
            </span>
          ) : (
            <Link
              key={opcao.id}
              href={opcao.href}
              replace
              scroll={false}
              role="radio"
              aria-checked="false"
              className="min-w-20 rounded-full border border-aurum-gold/30 bg-aurum-green-deep/60 px-5 py-2 text-center text-sm text-aurum-ice/80 transition-colors hover:border-aurum-gold/70 hover:text-aurum-gold"
            >
              {opcao.rotulo}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
