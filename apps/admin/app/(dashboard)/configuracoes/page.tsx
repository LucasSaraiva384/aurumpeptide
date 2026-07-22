import { Card, CardContent } from "@/components/ui/card";

// Página simples de info do negócio (sócios usados em Retiradas, contato de
// WhatsApp). Sem gestão de usuários/login nesta leva — ver CLAUDE.md.
const SOCIOS = [
  { nome: "Lucas", papel: "Sócio" },
  { nome: "Vinicius", papel: "Sócio" },
];

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-heading text-2xl text-foreground">Configurações</h2>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Sócios</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Nomes usados como conta fixa no módulo de Retiradas (Financeiro → Retiradas).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIOS.map((socio) => (
            <Card key={socio.nome}>
              <CardContent>
                <p className="font-heading text-foreground">{socio.nome}</p>
                <p className="text-sm text-muted-foreground">{socio.papel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Contato</h3>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">WhatsApp do negócio</p>
            <p className="mt-1 text-foreground">
              Configurado via <code className="text-xs">NEXT_PUBLIC_WHATSAPP_NUMBER</code> em{" "}
              <code className="text-xs">apps/site/.env.local</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
