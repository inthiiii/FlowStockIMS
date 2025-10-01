import express from "express";
import { 
  sendMessage, 
  getMessages, 
  deleteMessage, 
  replyMessage, 
  analyzeMessages 
} from "../controllers/contactController.js";

const router = express.Router();

// Send a contact message
router.post("/", sendMessage);

// Get all messages
router.get("/", getMessages);

// Delete a message by ID
router.delete("/:id", deleteMessage);

// Reply to a specific message
router.post("/reply/:id", replyMessage);

// Analyze messages (importance, summary)
router.post("/analyze", analyzeMessages);

export default router;