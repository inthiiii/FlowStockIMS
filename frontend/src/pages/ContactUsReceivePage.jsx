import React, { useEffect, useState } from "react";
import contactService from "../services/contactService";

const ContactUsReceivePage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    contactService.getMessages().then(setMessages);
  }, []);

  const handleDelete = async (id) => {
    await contactService.deleteMessage(id);
    setMessages(messages.filter((msg) => msg._id !== id));
  };

  const handleReply = async (id, email) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      await contactService.replyMessage(id, reply);
      alert("Reply sent!");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#023E8A" }}>Received Messages</h1>
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
const btn = { background: "#023E8A", color: "#fff", padding: "8px 12px", marginRight: "10px", border: "none", borderRadius: "5px" };

export default ContactUsReceivePage;