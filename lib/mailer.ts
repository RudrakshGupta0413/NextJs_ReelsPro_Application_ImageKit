
// Previous implementation using nodemailer (commented out)
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

import { Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendOtpEmail = async (to: string, otp: string) => {
    return await resend.emails.send({
        from: `'Reels Pro' <onboarding@resend.dev>`,
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

