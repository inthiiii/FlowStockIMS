import express from "express";
import { sendMessage, getMessages, deleteMessage, replyMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);
router.post("/reply/:id", replyMessage);

export default router;