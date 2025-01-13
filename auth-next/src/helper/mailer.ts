import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "amankarguwal0@gmail.com",
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
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
    // TODO : Add your email and password in .env file and configure mail for usage

    const mailOptions = {
      from: '"Aman Kumar 👻" <amankarguwal0@gmail.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text:
        emailType === "VERIFY"
          ? `
        Click on the link to verify your email: http://localhost:3000/verify/${userId}
      `
          : `
        Click on the link to reset your password: http://localhost:3000/reset-password/${userId}
      `,

      html:
        emailType === "VERIFY"
          ? `
        <p>Click on the link to verify your email: <a href="http://localhost:3000/verify/${userId}">Verify</a></p>
      `
          : `
        <p>Click on the link to reset your password: <a href="http://localhost:3000/reset-password/${userId}">Reset Password</a></p>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

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
