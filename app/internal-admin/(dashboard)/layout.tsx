import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { AdminSidebar } from "@/app/internal-admin/_components/admin-sidebar";
import { AdminTopbar } from "@/app/internal-admin/_components/admin-topbar";

// Map pathname → page title
function getPageTitle(pathname: string): string {
  if (pathname === "/internal-admin") return "Dashboard";
  if (pathname.startsWith("/internal-admin/products")) return "Product Management";
  if (pathname.startsWith("/internal-admin/users")) return "User Management";
  return "Admin Panel";
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/internal-admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={user as any} pageTitle="Admin Panel" />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
