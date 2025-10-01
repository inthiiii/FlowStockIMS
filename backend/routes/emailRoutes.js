import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env
const router = express.Router();

router.post("/send-receipt", async (req, res) => {
  const { to, from, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // pulled securely from .env
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // always send from your official email
      to,
      subject,
      html: message,
    });

    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email ❌" });
  }
});

export default router;