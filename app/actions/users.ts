"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession } from "@/app/actions/auth";

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
};

// ── List Users ────────────────────────────────────────────────────────────────
export async function getUsers(): Promise<{ data: User[]; error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { data: [], error: "Unauthorized request" };

    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        // specifically excluding password in list
      }
    });
    return { data, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
}

// ── Invite / Create user ──────────────────────────────────────────────────────
export async function inviteUser(
  email: string,
  role: "admin" | "staff",
  fullName: string,
  password?: string
): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    // If no password is provided in "invite", generate a random one or generic one
    const plainPassword = password || "VEA12345!";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        password: hashedPassword,
        isActive: true,
      },
    });

    revalidatePath("/internal-admin/users");
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ── Toggle active status ──────────────────────────────────────────────────────
export async function toggleUserActive(
  id: string,
  isActive: boolean
): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    await prisma.user.update({
      where: { id },
      data: { isActive: !isActive },
    });
    revalidatePath("/internal-admin/users");
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}
