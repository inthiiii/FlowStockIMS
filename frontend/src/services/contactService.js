import axios from "axios";

const API_URL = "/api/contact";

const sendMessage = (data) => axios.post(API_URL, data);
const getMessages = () => axios.get(API_URL).then(res => res.data);
const deleteMessage = (id) => axios.delete(`${API_URL}/${id}`);
const replyMessage = (id, reply) => axios.post(`${API_URL}/reply/${id}`, { reply });

export default { sendMessage, getMessages, deleteMessage, replyMessage };