"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";

function hashUsername(username: string) {
  const clean = username.trim().toLowerCase();
  return crypto.createHash("sha256").update(clean).digest("hex");
}

async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("user_id", userId, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10,
  });
}

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  if (!username || username.length < 3) {
    return { error: "Username must be at least 3 characters." };
  }

  const userId = hashUsername(username);

  const existing = db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
  if (existing) {
    return { error: "Username is already taken. Try another." };
  }

  try {
    db.prepare("INSERT INTO users (id) VALUES (?)").run(userId);
  } catch (err) {
    return { error: "System error. Try again." };
  }

  await setAuthCookie(userId);
  redirect("/");
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const userId = hashUsername(username);

  const existing = db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
  if (!existing) {
    return { error: "User not found. Please click 'Create User' instead." };
  }

  await setAuthCookie(userId);
  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  redirect("/login");
}
