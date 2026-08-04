// Mesma lógica de apps/site/lib/seo.ts::slugify() — duplicada aqui (não
// compartilhada entre apps) para gerar o slug sugerido de categorias,
// marcas e aplicações no admin. O campo slug no form continua editável
// manualmente; esta função só preenche o valor inicial/sugerido.
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
