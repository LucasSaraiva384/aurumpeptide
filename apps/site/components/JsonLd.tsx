/**
 * Serializa um objeto JSON-LD dentro de um <script type="application/ld+json">.
 * `.replace(/</g, "<")` evita que um `</script>` embutido no dado (ex.:
 * nome/descrição de produto) feche a tag prematuramente e quebre o HTML.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
