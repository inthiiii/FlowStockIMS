import ContactMessage from "../models/ContactMessage.js";
import nodemailer from "nodemailer";

// Send a contact message
export const sendMessage = async (req, res) => {
  try {
    const { name, email, number, message } = req.body;

    // Validate input
    if (!name || !email || !number || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("📩 Incoming contact message:", req.body); // Debug

    const newMessage = new ContactMessage({ name, email, number, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Error saving contact message:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reply to a message via email
export const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await ContactMessage.findById(req.params.id);

    if (!message) return res.status(404).json({ error: "Message not found" });

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