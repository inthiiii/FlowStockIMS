import express from "express";
import dotenv from "dotenv";
import { getTransporter, getMailerInfo } from "../services/emailService.js";

dotenv.config();
const router = express.Router();

router.get("/debug", async (_req, res) => {
  try {
    const info = await getMailerInfo();
    res.json({ ok: true, info });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error.message || error) });
  }
});

router.post("/send-receipt", async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: "to, subject and message are required" });
  }

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    });

    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email ❌", error: String(err?.message || err) });
  }
});

export default router;