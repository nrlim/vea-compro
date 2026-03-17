import type { Metadata } from "next";
import { getUsers } from "@/app/actions/users";
import { UsersClient } from "./_components/users-client";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const { data: users, error } = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">User Management</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          View, create, and manage admin and staff accounts.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to load users: {error}
        </div>
      )}

      <UsersClient initialProfiles={users} />
    </div>
  );
}
