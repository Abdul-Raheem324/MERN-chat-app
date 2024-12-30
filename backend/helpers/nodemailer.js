import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const userIdString = userId.toString();

    const hashedToken = await bcryptjs.hash(userIdString, 10);

    if (emailType === "verify") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
    });

    const mailOptions = {
      from: `"QualityConnect Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email for QualityConnect",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #4CAF50;">Welcome to QualityConnect!</h2>
          <p>Dear User,</p>
          <p>Thank you for registering with <strong>QualityConnect</strong>, your go-to chat application.</p>
          <p>To complete your registration, please verify your email address by clicking the link below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.APP_URL}/verify/${encodeURIComponent(
        hashedToken
      )}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Verify Your Email
            </a>
          </div>
          <p>If you did not register for an account, please ignore this email.</p>
          <p>Best regards,<br> The QualityConnect Team</p>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);

    console.log("Verification email sent.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
};
