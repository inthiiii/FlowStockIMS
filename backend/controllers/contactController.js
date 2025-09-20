import ContactMessage from "../models/ContactMessage.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await ContactMessage.findById(req.params.id);

    if (!message) return res.status(404).json({ error: "Message not found" });

    // Setup Gmail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: message.email,
      subject: "Reply from Nation Motor Spares",
      text: reply,
    });

    res.json({ message: "Reply sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};