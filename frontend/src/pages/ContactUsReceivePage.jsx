import React, { useEffect, useState } from "react";
import contactService from "../services/contactService";

const ContactUsReceivePage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    contactService.getMessages()
      .then(setMessages)
      .catch(err => setError("Failed to load messages"));
  }, []);

  const handleDelete = async (id) => {
    try {
      await contactService.deleteMessage(id);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch {
      alert("Delete failed!");
    }
  };

  const handleReply = async (id, email) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      try {
        await contactService.replyMessage(id, reply);
        alert("Reply sent!");
      } catch {
        alert("Reply failed!");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#023E8A" }}>Received Messages</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {messages.length === 0 && !error && <p>No messages yet.</p>}
      {messages.map((msg) => (
        <div key={msg._id} style={cardStyle}>
          <p><strong>Name:</strong> {msg.name}</p>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Number:</strong> {msg.number}</p>
          <p><strong>Message:</strong> {msg.message}</p>
          <button onClick={() => handleReply(msg._id, msg.email)} style={btn}>Reply</button>
          <button onClick={() => handleDelete(msg._id)} style={{ ...btn, background: "red" }}>Delete</button>
        </div>
      ))}
    </div>
  );
};

const cardStyle = { border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "5px" };
const btn = { background: "#023E8A", color: "#fff", padding: "8px 12px", marginRight: "10px", border: "none", borderRadius: "5px", cursor: "pointer" };

export default ContactUsReceivePage;