import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
<<<<<<< HEAD
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/server";
=======
>>>>>>> upstream/main

export const experimental_ppr = true;

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
<<<<<<< HEAD
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  const isCollapsed = sidebarCookie === "false";
  const isWebroot = process.env.WEBROOT === "true";
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <DataStreamProvider>
      <TopNav isWebroot={isWebroot} isLoggedIn={isLoggedIn} />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar isWebroot={isWebroot} />
        <SidebarInset className="pt-[73px]">{children}</SidebarInset>
=======
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <DataStreamProvider>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
>>>>>>> upstream/main
      </SidebarProvider>
    </DataStreamProvider>
  );
}
