"use server";

import { generateAuthToken, verifyCredentials } from "@/lib/helper/auth-helper";
import { validateLoginInput } from "@/lib/validation-schema";

import { cookies, headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export async function login(values: any) {
  const validateInput = validateLoginInput(values);

  try {
    const validatedData = validateInput.validInputs as LoginInput;
    const isValid = await verifyCredentials(validatedData);

    if (!isValid) {
      return { error: "Invalid credentials" };
    }

    // Generate JWT token or whatever session mechanism you're using
    const token = await generateAuthToken(validatedData.email);

    // Set the authentication cookie
    const cookieStore = await cookies();

    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Get the redirect URL or default to dashboard
    // const redirectTo = cookieStore.get("redirectTo")?.value || "/dashboard";
    // cookieStore.delete("redirectTo");

    // return { success: "Login successful" };
  } catch (error: any) {
    return { error: "An unexpected error occurred" + error };
  }

  const referer = (await headers()).get("referer") || "";
  const searchParams = new URL(referer).searchParams;
  const redirectTo = searchParams.get("from") || "/dashboard";
  redirect(redirectTo, RedirectType.replace);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/auth/login");
}
