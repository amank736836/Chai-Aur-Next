"use server";

import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const verifyEmail = async ({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
    });

    const link = `${process.env.DOMAIN}/api/users/verify?token=${hashedToken}`;

    const mailOptions = {
      from: '"Aman Kumar 👻" <virtuo@store.com>',
      to: email,
      subject: "Verify your email",
      text: `
          Copy and paste the link below in your browser to verify your email:
          : ${link}
      `,

      html: `<p>Click on the link to verify your email: <a href="${link}">Verify : </a><a href="${link}">${link}</a></p><br>or copy and paste the link below in your browser:<br><p>${link}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return {
      success: true,
      message: `Email sent to ${email}`,
      data: mailResponse,
    };
  } catch (error) {
    console.error("Error in sending verification email: ", error);

    return NextResponse.json({
      success: false,
      message: "Error in sending verification email",
      data: error,
    });
  }
};

export const resetPassword = async ({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000,
    });

    const link = `${process.env.DOMAIN}/api/users/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: '"Aman Kumar 👻" <virtuo@store.com>',
      to: email,
      subject: "Reset your password",
      text: `
          Copy and paste the link below in your browser to reset your email:
          : ${link}
      `,

      html: `<p>Click on the link to reset your email: <a href="${link}">Verify : </a><a href="${link}">${link}</a></p><br>or copy and paste the link below in your browser:<br><p>${link}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Reset password email sent to ${email}`,
      data: mailResponse,
    });
  } catch (error) {
    console.error("Error in sending reset password email: ", error);

    return NextResponse.json({
      success: false,
      message: "Error in sending reset password email",
      data: error,
    });
  }
};
