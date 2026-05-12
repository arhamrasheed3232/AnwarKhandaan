"use server";

import { cookies } from "next/headers";
import authConfig from "@/data/auth-config.json";

export async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === authConfig.username && password === authConfig.password) {
    const cookieStore = await cookies();
    cookieStore.set("khandaan_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("khandaan_auth");
}
