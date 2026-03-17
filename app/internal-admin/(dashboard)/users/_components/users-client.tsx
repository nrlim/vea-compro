"use client";

import { useState, useTransition } from "react";
import { inviteUser, toggleUserActive, type User } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlus,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-navy/5 text-navy border-navy/10",
  staff: "bg-slate-100 text-slate-600 border-slate-200",
};

interface UsersClientProps {
  initialProfiles: User[];
}

export function UsersClient({ initialProfiles }: UsersClientProps) {
  const [profiles, setProfiles] = useState<User[]>(initialProfiles);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "staff" as "admin" | "staff",
  });
  const [isPending, startTransition] = useTransition();

  function getInitials(profile: User) {
    if (profile.fullName) {
      return profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return profile.email.slice(0, 2).toUpperCase();
  }

  function handleToggleActive(profile: User) {
    startTransition(async () => {
      const result = await toggleUserActive(profile.id, profile.isActive);
      if (result.error) {
        toast.error("Failed to update user", { description: result.error });
        return;
      }
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(
        profile.isActive ? "User deactivated" : "User activated",
        { description: profile.email }
      );
    });
  }

  function handleInvite() {
    startTransition(async () => {
      const result = await inviteUser(
        inviteForm.email,
        inviteForm.role,
        inviteForm.fullName,
        inviteForm.password
      );
      if (result.error) {
        toast.error("Failed to create user", { description: result.error });
        return;
      }
      toast.success("User created!", { description: inviteForm.email });
      setInviteOpen(false);
      setInviteForm({ email: "", fullName: "", password: "", role: "staff" });
    });
  }

  const activeCount = profiles.filter((p) => p.isActive).length;

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: profiles.length, color: "text-navy" },
          { label: "Active", value: activeCount, color: "text-emerald-600" },
          { label: "Inactive", value: profiles.length - activeCount, color: "text-slate-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-end">
        <Button
          id="invite-user-btn"
          onClick={() => setInviteOpen(true)}
          className="bg-navy hover:bg-navy-light text-white shadow-sm gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-500 font-semibold">User</TableHead>
              <TableHead className="text-slate-500 font-semibold">Role</TableHead>
              <TableHead className="text-slate-500 font-semibold">Status</TableHead>
              <TableHead className="text-slate-500 font-semibold hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-slate-500 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 border-slate-200">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Users className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200 shrink-0">
                        <AvatarFallback className="bg-slate-100 text-slate-500 text-xs font-semibold">
                          {getInitials(profile)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">
                          {profile.fullName ?? "—"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
                        ROLE_STYLES[profile.role] ?? ROLE_STYLES["staff"]
                      }`}
                    >
                      {profile.role === "admin" ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <UserIcon className="h-3 w-3" />
                      )}
                      {profile.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        profile.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          profile.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {profile.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden md:table-cell font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(profile)}
                      disabled={isPending}
                      className={
                        profile.isActive
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2 font-medium"
                          : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-7 px-2 font-medium"
                      }
                      id={`toggle-user-${profile.id}`}
                    >
                      {profile.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Invite Dialog ──────────────────────────────────────────────── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="bg-white border-slate-200 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy font-serif">Create New User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name" className="text-slate-600 font-medium text-sm">Full Name</Label>
              <Input
                id="invite-name"
                value={inviteForm.fullName}
                onChange={(e) => setInviteForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="John Doe"
                className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-slate-600 font-medium text-sm">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="staff@ptvea.co.id"
                className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-password" className="text-slate-600 font-medium text-sm">Password</Label>
              <Input
                id="invite-password"
                type="password"
                value={inviteForm.password}
                onChange={(e) => setInviteForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Leave blank for VEA12345!"
                className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-slate-600 font-medium text-sm">Role</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(v) => setInviteForm((f) => ({ ...f, role: v as "admin" | "staff" }))}
              >
                <SelectTrigger
                  id="invite-role"
                  className="bg-white border-slate-200 text-navy focus-visible:ring-gold shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="admin" className="text-slate-600 focus:bg-slate-50 focus:text-navy">
                    Admin
                  </SelectItem>
                  <SelectItem value="staff" className="text-slate-600 focus:bg-slate-50 focus:text-navy">
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setInviteOpen(false)}
              className="text-slate-500 hover:text-navy hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={isPending || !inviteForm.email || !inviteForm.fullName}
              className="bg-navy hover:bg-navy-light text-white shadow-sm"
              id="send-invite-btn"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating…</>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
