"use server";

import { getUserByEmail } from "@/lib/helper/db-helper";
import {
  generateVerificationToken,
  getVerificationTokenByToken,
  sendVerificationEmail,
} from "@/lib/helper/email-helper";
import { hashPassword } from "@/lib/helper/helper";
import { db } from "@/lib/prisma_client";
import { validateSignupInput } from "@/lib/validation-schema";

export const register_user = async (values: any) => {
  const validateInput = validateSignupInput(values);

  try {
    if (!validateInput.isValid) {
      return { error: "Invalid fields" };
    }
    const { email, password, first_name, last_name } =
      validateInput.validInputs as SignupInput;

    const hashedPassword = await hashPassword(password);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exist!" };
    }

    const user = await db.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });

    //Send verification token email

    // const verificationToken = await generateVerificationToken(email);

    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token
    // );
    // Password_1

    // return { success: "Verification email sent" };
    return {
      success: "Account created successfully, Please login to continue",
    };
  } catch (error) {
    return { error: `An error occured: ${error}` };
  }
};

export const verifyEmail = async (email: string, token: string) => {
  const existingToken = await getVerificationTokenByToken(email, token);
  if (!existingToken) return { error: "Invalid or expired token" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Invalid or expired token" };

  //   const existingUser = await getUserByEmail(existingToken.email)

  //   if (!existingUser) return { error: "Email does not exist!" };

  await db.user.update({
    where: { id: existingToken.email },
    data: {
      emailVerified: new Date(),
      isVerified: true,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified successfully" };
};
