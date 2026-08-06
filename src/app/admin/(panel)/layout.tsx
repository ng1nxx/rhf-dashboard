import { cookies } from "next/headers";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/auth/dal";

/**
 * Shell for the signed-in admin panel.
 *
 * Lives in a `(panel)` route group so `/admin/login` — which sits in the same
 * `app/admin/` directory — does not inherit the sidebar. Someone who has not
 * signed in has nothing to navigate. The parentheses keep the group out of the
 * URL, so this is still `/admin`.
 *
 * The auth check here is for *display only*: it decides whose name to show and
 * whether to offer the Pengaturan link. Layouts do not re-render on navigation
 * and do not control whether their child segments run, so each page calls
 * `verifySession()` itself. `src/proxy.ts` is what stops a signed-out visitor
 * before any of this renders.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    // Unreachable in practice — proxy redirects first. Rendering the chrome
    // with no account behind it would be worse than rendering nothing.
    return null;
  }

  // The sidebar writes its open/closed state to this cookie. Reading it on the
  // server means a collapsed sidebar renders collapsed in the first HTML,
  // instead of flashing open until hydration catches up.
  const sidebarState = (await cookies()).get("sidebar_state")?.value;

  return (
    // Radix's Tooltip.Root throws without a provider above it, and the sidebar
    // renders one for every menu button when collapsed to the icon rail. Scoped
    // here rather than to the root layout, because the public site has no
    // tooltips and should not carry the context.
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={sidebarState !== "false"}>
        <AdminSidebar
          userName={session.name}
          userEmail={session.email}
          role={session.role}
        />

        <SidebarInset className="bg-rhf-cream">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
