import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
    return await transporter.sendMail({
        from: `'Reels Pro' <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Login OTP Code",
        html: `
        <h2>Your Code</h2>
        <p>Your OTP code for login is:</p>
        <h1 style="font-weight:bold;">${otp}</h1>
        <p>This code is valid for 5 minutes.</p>
      `,
    });
};

