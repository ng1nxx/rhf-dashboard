"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoLockup, LogoMark } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/auth/actions";
import { ADMIN_NAV } from "@/lib/admin/navigation";

/**
 * Admin navigation.
 *
 * A client component for one reason: `usePathname()`, to mark the current
 * destination. The session is *not* read here — the name, email, and role
 * arrive as props from the server layout, so nothing about the account
 * crosses into client code beyond what is already on screen.
 */
export function AdminSidebar({
  userName,
  userEmail,
  role,
}: {
  userName: string;
  userEmail: string;
  role: "ADMIN" | "EDITOR";
}) {
  const pathname = usePathname();

  const items = ADMIN_NAV.filter(
    (item) => !item.adminOnly || role === "ADMIN",
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        {/*
          `href={null}` stops LogoLockup rendering its own anchor. Left on, it
          would nest an <a> inside this one — invalid HTML — and it labels
          itself "ke beranda", which is the wrong destination in here.
        */}
        <Link
          href="/admin"
          aria-label="RHF Catering — ke dashboard"
          className="flex items-center rounded-md focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          {/* The wordmark cannot fit the icon rail, so only the mark survives
              the collapse. */}
          <span className="group-data-[collapsible=icon]:hidden">
            <LogoLockup href={null} size={38} />
          </span>
          <span className="hidden group-data-[collapsible=icon]:block">
            <LogoMark size={28} />
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kelola</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                // "/admin" would otherwise match every child route.
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                if (!item.ready) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        // Rendered as a span, never an anchor: the page does
                        // not exist yet, and a link to a 404 is worse than a
                        // control that visibly is not ready.
                        asChild
                        aria-disabled
                        tooltip={`${item.label} — segera`}
                        className="cursor-default opacity-55 hover:bg-transparent hover:text-sidebar-foreground"
                      >
                        <span>
                          <item.icon aria-hidden />
                          <span>{item.label}</span>
                          <span className="ml-auto rounded-full bg-sidebar-accent px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-sidebar-accent-foreground uppercase group-data-[collapsible=icon]:hidden">
                            segera
                          </span>
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {userName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton
                asChild
                tooltip="Keluar"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <button type="submit" className="w-full">
                  <LogOut aria-hidden />
                  <span>Keluar</span>
                </button>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
