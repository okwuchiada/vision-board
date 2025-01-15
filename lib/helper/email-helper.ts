import { db } from "../prisma_client";
import { UUIDv4 } from "./helper";
import nodemailer from "nodemailer";

export const generateVerificationToken = async (email: string) => {
  const token = UUIDv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const v_token = await db.verificationToken.findFirst({
      where: { email },
    });
    return v_token;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (
  email: string,
  token: string
) => {
  try {
    //   const v_token = await db.verificationToken.findUnique({
    //     where: { token },
    //   });

    const v_token = await db.verificationToken.findUnique({
      where: {
        email_token: {
          email,
          token,
        },
      },
    });
    return v_token;
  } catch (error) {
    return null;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  // Configure email transport (using nodemailer)
  const transporter = nodemailer.createTransport({
    // host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: parseInt(process.env.SMTP_PORT || '587'),
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });

  const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    // from: '"ManiDream" <noreply@visionboard.com>',
    from: `"Vision Board" ${process.env.SMTP_FROM}`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h1>Welcome to ManiDream!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="
        padding: 12px 24px;
        background-color: #3B82F6;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
        margin: 16px 0;
      ">Verify Email Address</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  };

  // Send email
  //   return transporter.sendMail(mailOptions);
  await transporter.sendMail(mailOptions);
};
