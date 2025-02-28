import Lawyer from "../models/lawyer.model.js";
import jwt from 'jsonwebtoken';


export const getLawyerData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const lawyer = await Lawyer.findById(userId);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }

    res.status(200).json({
      success: true,
      UserData: {
        _id: lawyer._id,
        fullName: req.lawyer.fullName,
        email: req.lawyer.email,
        contact: req.lawyer.contact,
        isVerified: req.lawyer.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};