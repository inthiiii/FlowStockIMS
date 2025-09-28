import InternalUser from '../models/InternalUser.js';

export const createInternalUser = async (req, res) => {
  try {
    const { name, phoneNumber, address, role } = req.body;
    const user = new InternalUser({ name, phoneNumber, address, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInternalUsers = async (req, res) => {
  try {
    const users = await InternalUser.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};