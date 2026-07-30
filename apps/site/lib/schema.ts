import type { Produto } from "@/lib/types";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { absoluteUrl, buildProductSlug, SITE_URL } from "@/lib/seo";

// Funções puras que retornam objetos JSON-LD (schema.org), consumidos por
// <JsonLd data={...} /> (apps/site/components/JsonLd.tsx). Sem endereço
// físico documentado em docs/marca.md, o schema de identidade da empresa
// usa Organization + WebSite (não LocalBusiness — decisão confirmada com o
// usuário, ver plano de SEO técnico).

const INSTAGRAM_URL = "https://www.instagram.com/aurumpeptide/";
const LOGO_URL = absoluteUrl("/logo-oficial-com-nome.png");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aurum Peptide",
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: [INSTAGRAM_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: `https://wa.me/${WHATSAPP_NUMBER}`,
        areaServed: "BR",
        availableLanguage: ["Portuguese"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aurum Peptide",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** `produto` já com as colunas `seo_*`; `url` é a URL absoluta canônica da página do produto. */
export function productSchema(
  produto: Pick<Produto, "id" | "nome" | "descricao" | "categoria" | "preco" | "imagem_url" | "imagens" | "estoque_atual">,
  url: string,
) {
  const imagens = produto.imagens.length > 0 ? produto.imagens : produto.imagem_url ? [produto.imagem_url] : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.descricao ?? undefined,
    category: produto.categoria ?? undefined,
    image: imagens.length > 0 ? imagens : undefined,
    sku: produto.id,
    url,
    brand: {
      "@type": "Brand",
      name: "Aurum Peptide",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "BRL",
      price: produto.preco,
      availability:
        produto.estoque_atual > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Aurum Peptide",
      },
    },
  };
}

/** `produtos` já filtrados (ativos/publicados); `url` é a URL absoluta da página que lista o catálogo. */
export function collectionPageSchema(
  produtos: Array<Pick<Produto, "id" | "nome" | "seo_slug">>,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catálogo Aurum Peptide",
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: produtos.map((produto, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: produto.nome,
        url: absoluteUrl(`/produtos/${buildProductSlug(produto)}`),
      })),
    },
  };
}

export function webPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Aurum Peptide",
      url: SITE_URL,
    },
  };
}

// Preparadas para uso futuro (não renderizadas em nenhuma página ainda):
// entram assim que houver uma seção de perguntas frequentes ou avaliações
// de produto vinculadas a dados reais (nada inventado por ora).

export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function reviewSchema({
  itemName,
  url,
  author,
  reviewBody,
  ratingValue,
}: {
  itemName: string;
  url: string;
  author: string;
  reviewBody: string;
  ratingValue: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: itemName,
      url,
    },
    author: {
      "@type": "Person",
      name: author,
    },
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
    },
  };
}
