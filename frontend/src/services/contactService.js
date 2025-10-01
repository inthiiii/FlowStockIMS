import axios from "axios";

const API_URL = "http://localhost:3000/api/contact";

// Send message
const sendMessage = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err.response?.data || err.message);
    throw err;
  }
};

// Get messages
const getMessages = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching messages:", err.response?.data || err.message);
    throw err;
  }
};

// Delete message
const deleteMessage = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (err) {
    console.error("Error deleting message:", err.response?.data || err.message);
    throw err;
  }
};

// Reply to message
const replyMessage = async (id, reply) => {
  try {
    await axios.post(`${API_URL}/reply/${id}`, { reply });
  } catch (err) {
    console.error("Error sending reply:", err.response?.data || err.message);
    throw err;
  }
};

// function to analyze messages
const analyzeMessages = async (messages) => {
  const response = await axios.post(`${API_URL}/analyze`, { messages });
  return response.data;
};

export default { sendMessage, getMessages, deleteMessage, replyMessage, analyzeMessages, };