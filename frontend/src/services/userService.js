import API from "./api";

// Register
export const registerUser = (userData) => API.post("/users/register", userData);

// Login
export const loginUser = (userData) => API.post("/users/login", userData);

// Get Profile
export const getUserProfile = () => API.get("/users/profile");
