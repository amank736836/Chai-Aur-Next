"use server";

import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: string;
  userId: string;
}) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000,
      });
    }

    const mailOptions = {
      from: '"Aman Kumar 👻" <virtuo@store.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text:
        emailType === "VERIFY"
          ? `
        Click on the link to verify your email: ${process.env.DOMAIN}/verify?token=${hashedToken}
      `
          : `
        Click on the link to reset your password: ${process.env.DOMAIN}/reset-password?token=${hashedToken}
      `,

      html:
        emailType === "VERIFY"
          ? `
        <p>Click on the link to verify your email: <a href="${process.env.DOMAIN}/verify?token=${hashedToken}">Verify</a></p>
        <br>
        or copy and paste the link below in your browser:
        <br>
        <p>http://localhost:3000/verify?token=${hashedToken}</p>
      `
          : `
        <p>Click on the link to reset your password: <a href="${process.env.DOMAIN}/reset-password?token=${hashedToken}">Reset Password</a></p>
        <br>
        or copy and paste the link below in your browser:
        <br>
        <p>/reset-password?token=${hashedToken}</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return {
      success: true,
      message: `Email sent to ${email}`,
      data: mailResponse,
    };
  } catch (error) {
    console.error("Error sending email: ", error);

    return {
      success: false,
      message: "Error sending email",
      data: error,
    };
  }
};
