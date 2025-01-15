"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/helper/auth-helper";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const userData = await verifyToken(token);

    return userData;
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return null;
  }
}

export const getUser = async () => {
  const user = await getCurrentUser();
  return user;
};

// export const getCurrentSession = async () => {
//   const session = await getServerSession(authOptions);
//   return session;
// };

// export async function saveUserData(formData: FormData) {
//   const session = await getCurrentSession();

//   if (!session) {
//     throw new Error("Unauthorized");
//   }

//   const userEmail = session.user?.email;
//   const userData = formData.get("data");

//   // Perform backend logic
//   console.log(`Saving data for ${userEmail}:`, userData);

//   revalidatePath("/dashboard");
// }
