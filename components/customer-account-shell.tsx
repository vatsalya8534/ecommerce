import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/account-sidebar";
import type { AuthUser } from "@/lib/auth-types";

export function CustomerAccountShell({
  activeSection,
  user,
  children,
}: {
  activeSection: "cart" | "orders" | "profile";
  user?: AuthUser;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_28%),linear-gradient(180deg,#f7f9f4_0%,#eef3e7_48%,#f9fbf7_100%)]">
      <div className="mx-auto grid w-full gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <AccountSidebar activeSection={activeSection} user={user} />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
