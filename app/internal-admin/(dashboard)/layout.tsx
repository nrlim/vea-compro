import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { AdminSidebar } from "@/app/internal-admin/_components/admin-sidebar";
import { AdminTopbar } from "@/app/internal-admin/_components/admin-topbar";

// Map pathname → page title
function getPageTitle(pathname: string): string {
  if (pathname === "/internal-admin") return "Dasbor";
  if (pathname.startsWith("/internal-admin/products")) return "Manajemen Produk";
  if (pathname.startsWith("/internal-admin/users")) return "Manajemen Pengguna";
  return "Panel Admin";
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

  // Next.js standard async server component layout does not have full reactive pathname matching trivially without headers,
  // so we'll pass a general title for topbar for now, or just leave it as "Panel Admin".
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={user as any} pageTitle="Panel Admin" />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
