import bcrypt from "bcryptjs";
import { db } from "../prisma_client";
import { SignJWT, jwtVerify } from "jose";
import { cache } from "react";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "wDkpl0dRFd7y4mWWBkHAgHqesIOyQD3f22JZ76GhnCvNucF0OMXPhUmAwhGhYGmr"
);

export async function verifyCredentials({ email, password }: LoginInput) {
  try {
    // Get user from database
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return false;
    }

    // Compare password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return false;
    }

    return user;
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return false;
  }
}

// Generate JWT token
export async function generateAuthToken(email: string) {
  try {
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate authentication token");
  }
}

// Verify JWT token and return user data
export async function verifyToken(token: string | undefined) {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const email = verified.payload.email as string;

    if (!email) {
      throw new Error("Invalid token payload");
    }

    // Get user data from database
    const user = await db.user.findUnique({
      where: { email },
      // select: {
      //   id: true,
      //   email: true,
      // },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}
