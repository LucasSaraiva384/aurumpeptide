import type { Metadata } from "next";
import { Container } from "@aurum/ui";
import { absoluteUrl } from "@/lib/seo";
import { buildWhatsappLink } from "@/lib/whatsapp";

const TITLE = "Política de Privacidade";
const DESCRIPTION =
  "Como a Aurum Peptide coleta, usa e protege seus dados pessoais, incluindo o atendimento pelo WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/politica-de-privacidade"),
  },
  robots: { index: true, follow: true },
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl text-aurum-ice">{titulo}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-aurum-ice/70">{children}</div>
    </section>
  );
}

export default function PoliticaDePrivacidadePage() {
  return (
    <Container className="flex flex-col gap-12 py-16 sm:py-24">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">Aurum Peptide</span>
        <h1 className="font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">{TITLE}</h1>
        <p className="mx-auto max-w-xl text-sm text-aurum-ice/70">
          Última atualização: 19 de agosto de 2026.
        </p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <Secao titulo="Quem somos">
          <p>
            Este site e os canais de atendimento da Aurum Peptide (incluindo o WhatsApp) são operados por{" "}
            <strong className="text-aurum-ice">50.701.764 LUCAS VINICIUS LISBOA SARAIVA</strong>, CNPJ{" "}
            <strong className="text-aurum-ice">50.701.764/0001-82</strong>, doravante &ldquo;Aurum Peptide&rdquo;,
            &ldquo;nós&rdquo;. Esta política explica quais dados pessoais coletamos, para que usamos e quais são os
            seus direitos, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </Secao>

        <Secao titulo="Dados que coletamos">
          <p>
            <strong className="text-aurum-ice">Navegação no site.</strong> Ao visitar aurumpeptide.com.br, podemos
            coletar dados de navegação (páginas visitadas, origem do acesso, dispositivo) por meio de ferramentas de
            analytics (Google Analytics/Google Tag Manager), quando ativas.
          </p>
          <p>
            <strong className="text-aurum-ice">Atendimento pelo WhatsApp.</strong> Quando você inicia uma conversa
            com a Aurum Peptide pelo WhatsApp, coletamos e armazenamos: seu número de telefone, o nome de perfil
            público exibido no WhatsApp (quando disponível) e o conteúdo das mensagens trocadas com nossa equipe de
            atendimento. Esses dados são necessários para dar continuidade ao atendimento e evitar o reenvio
            repetido da mensagem de boas-vindas.
          </p>
        </Secao>

        <Secao titulo="Para que usamos seus dados">
          <ul className="list-disc space-y-2 pl-5">
            <li>Responder e dar continuidade ao seu atendimento pelo WhatsApp;</li>
            <li>Enviar a tabela de preços dos produtos e informações sobre o catálogo;</li>
            <li>Convidar você para o Grupo VIP da Aurum Peptide no WhatsApp, quando aplicável;</li>
            <li>Entender o desempenho do site e dos canais de atendimento (dados agregados de navegação).</li>
          </ul>
          <p>
            O atendimento pelo WhatsApp é realizado por pessoas da nossa equipe — não usamos inteligência artificial
            conversacional para responder mensagens de clientes.
          </p>
        </Secao>

        <Secao titulo="Com quem compartilhamos">
          <p>Não vendemos seus dados pessoais a terceiros. Compartilhamos dados apenas com:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-aurum-ice">Meta Platforms, Inc.</strong>, provedora da API oficial do WhatsApp
              Business, necessária para operar o canal de atendimento;
            </li>
            <li>
              <strong className="text-aurum-ice">Supabase</strong>, provedor de banco de dados que hospeda, de forma
              segura, os registros de contato e mensagens.
            </li>
          </ul>
        </Secao>

        <Secao titulo="Armazenamento e segurança">
          <p>
            Os dados de contato e mensagens do WhatsApp ficam em um banco de dados com controle de acesso restrito
            (Row Level Security), acessível apenas pelos sistemas internos da Aurum Peptide. Mantemos esses dados
            enquanto durar o relacionamento comercial com você, ou até que você solicite a exclusão.
          </p>
        </Secao>

        <Secao titulo="Seus direitos (LGPD)">
          <p>Você pode, a qualquer momento, solicitar:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Confirmação de que tratamos seus dados e acesso a eles;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Exclusão dos seus dados, quando não houver obrigação legal de retê-los;</li>
            <li>Informação sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, fale com a gente pelo{" "}
            <a className="text-aurum-gold underline" href={buildWhatsappLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp da Aurum Peptide
            </a>
            .
          </p>
        </Secao>

        <Secao titulo="Alterações a esta política">
          <p>
            Podemos atualizar esta política periodicamente para refletir mudanças em nossas práticas ou por
            exigência legal/regulatória. A data no topo desta página indica a versão mais recente.
          </p>
        </Secao>
      </div>
    </Container>
  );
}
