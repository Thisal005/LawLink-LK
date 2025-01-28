import userModel from "../models/user.model.js";

import jwt from 'jsonwebtoken';

export const getUserData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ success: false, message: 'Unauthorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
