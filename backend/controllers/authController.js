import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, role } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, phone, email: email.toLowerCase(), passwordHash, role: role || 'user' });
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }
    
    return res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find({}, '-passwordHash -resetPasswordToken -resetPasswordExpires');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, email, role } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, phone, email, role },
      { new: true, runValidators: true, select: '-passwordHash -resetPasswordToken -resetPasswordExpires' }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update currently authenticated user's credentials (email, names, phone, password)
export const changeCredentials = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.id;
    if (!userId) return res.status(400).json({ message: 'User id is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { firstName, lastName, phone, email, currentPassword, newPassword } = req.body;

    if (email) {
      const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
      user.email = email.toLowerCase();
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    if (newPassword) {
      // Verify current password before changing
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required to change password' });
      const ok = await user.comparePassword(currentPassword);
      if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

      // Reuse same policy as reset: exactly 6 chars, 1 uppercase, 1 number, 1 special
      const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6}$/;
      if (!strongRegex.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be exactly 6 characters and include 1 uppercase letter, 1 number, and 1 special character' });
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
    }

    await user.save();

    return res.json({ id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, phone: user.phone });
  } catch (err) {
    console.error('changeCredentials error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // Generate reset token
      const resetToken = user.generateResetToken();
      await user.save();
      
      // Send password reset email
      try {
        await sendPasswordResetEmail(user.email, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Clear the token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      }
    }
    
    // Always return the same message for security (don't reveal if email exists)
    return res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Validate password strength: exactly 6, 1 uppercase, 1 number, 1 special char
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6}$/;
    if (!strongRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be exactly 6 characters and include 1 uppercase letter, 1 number, and 1 special character' });
    }
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


