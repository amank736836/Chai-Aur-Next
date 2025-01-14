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

    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verify?token=${hashedToken}`
        : `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: '"Aman Kumar 👻" <virtuo@store.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text: `
          Copy and paste the link below in your browser to
          ${emailType === "VERIFY" ? "verify" : "reset"} your email:
          : ${link}
      `,

      html: `<p>Click on the link to ${
        emailType === "VERIFY" ? "verify" : "reset"
      } your email: <a href="${link}">Verify : </a><a href="${link}">${link}</a></p><br>or copy and paste the link below in your browser:<br><p>${link}</p>`,
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
