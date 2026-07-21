import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SignOutButton } from "@/components/SignOutButton";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/produtos", label: "Produtos" },
  { href: "/pedidos", label: "Pedidos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/transacoes", label: "Transações" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured) {
    // Defesa em profundidade: o middleware já redireciona não-autenticados
    // para /login; esta checagem cobre o caso de o layout renderizar antes
    // do middleware (ex.: navegação client-side) ou rodar isoladamente.
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login");
      }
    } catch {
      redirect("/login");
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-sidebar-border bg-sidebar p-6">
        <h1 className="font-heading mb-8 text-xl text-sidebar-foreground">Aurum Admin</h1>
        <nav className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 bg-background p-8">{children}</main>
    </div>
  );
}
