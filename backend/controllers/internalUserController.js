// controllers/internalUserController.js
import InternalUser from '../models/InternalUser.js';

// A helper function to parse Mongoose errors
const getErrorMessage = (err) => {
  if (err.code === 11000) {
    return "This Employee ID already exists. Please try again.";
  }
  if (err.name === 'ValidationError') {
    return Object.values(err.errors).map(val => val.message).join(' ');
  }
  return err.message;
};

export const createUser = async (req, res) => {
  try {
    const user = new InternalUser(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    console.error("Create user error:", e);
    res.status(400).json({ message: getErrorMessage(e) });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await InternalUser.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const u = await InternalUser.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Added { runValidators: true } to ensure updates are also validated
    const u = await InternalUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await InternalUser.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const searchUsers = async (req, res) => {
    // ... your search function remains the same
    try {
        const { query } = req.query;
        if (!query) {
          return res.status(400).json({ error: 'Search query required' });
        }
        const users = await InternalUser.find({
          $or: [
            { employeeId: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
          ],
          active: true
        }).sort({ createdAt: -1 });
        res.json(users);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
};