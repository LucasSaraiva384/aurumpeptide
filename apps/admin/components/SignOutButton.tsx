"use client";

import { useRouter } from "next/navigation";
import { Button } from "@aurum/ui";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleSignOut} className="w-full">
      Sair
    </Button>
  );
}
