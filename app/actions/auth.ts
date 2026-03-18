"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, verifyToken } from "@/lib/auth";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid credentials" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    return { error: "Invalid credentials or account inactive" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  const token = await signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  revalidatePath("/", "layout");
  redirect("/internal-admin");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  revalidatePath("/", "layout");
  redirect("/internal-admin/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;

  return await verifyToken(token);
}
