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

// Analyze and rank contact messages
export const analyzeMessages = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "No messages provided for analysis" });
    }

    // Simple rule-based analysis for now (can be replaced with AI later)
    const analyzed = messages.map((msg) => {
      const text = msg.message.toLowerCase();
      let importance = "Normal";
      let keywords = [];

      // Detect urgency or complaint words
      if (text.includes("urgent") || text.includes("immediate") || text.includes("asap")) {
        importance = "High";
        keywords.push("Urgent");
      }
      if (text.includes("complaint") || text.includes("problem") || text.includes("issue")) {
        importance = "High";
        keywords.push("Complaint");
      }
      if (text.includes("thank") || text.includes("good") || text.includes("appreciate")) {
        importance = "Low";
        keywords.push("Positive");
      }

      // Basic summary (first 20 words)
      const summary = msg.message.split(" ").slice(0, 20).join(" ") + (msg.message.split(" ").length > 20 ? "..." : "");

      return {
        id: msg._id,
        name: msg.name,
        email: msg.email,
        importance,
        summary,
        keywords,
      };
    });

    res.status(200).json({ analyzed });
  } catch (error) {
    console.error("Error analyzing messages:", error);
    res.status(500).json({ message: "Error analyzing messages", error: error.message });
  }
};