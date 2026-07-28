import { ClienteForm } from "@/components/ClienteForm";

export default function NovoClientePage() {
  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Novo cliente</h2>
      <ClienteForm />
    </div>
  );
}
